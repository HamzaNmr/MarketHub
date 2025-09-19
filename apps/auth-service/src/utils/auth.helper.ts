import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { sendEmail } from './sendMail';
import redis from '@market-hub/packages/libs/redis';
import prisma from '@market-hub/packages/libs/prisma';
import { ValidationError } from '@market-hub/packages/error-handler';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex for validation

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { email, password, name, phone_number, country } = data;

    if(
        !email || 
        !password || 
        !name || 
        (userType === "seller" && (!phone_number || !country))
    ) {
        throw new ValidationError("Missing required fields.");
    }

    if(!emailRegex.test(email)) {
        throw new ValidationError("Invalid email format.");
    }
}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    const isOtpLocked = await redis.get(`otp_lock:${email}`);
    if(isOtpLocked) {
        return next(new ValidationError("Account is temporarily locked due to multiple failed OTP attempts. Please try again after 30 minutes."));
    }

    const isOtpSpamLocked = await redis.get(`otp_spam_lock:${email}`);
    if(isOtpSpamLocked) {
        return next(new ValidationError("Too many OTP requests. Please try again after 1 hour."));
    }

    const isOtpCooldown = await redis.get(`otp_cooldown:${email}`);
    if(isOtpCooldown) {
        return next(new ValidationError("OTP already sent. Please wait 1 minute before requesting a new OTP."));
    }
}

export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let optRequests = parseInt((await redis.get(otpRequestKey)) || '0');

    if(optRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // Lock for 1 hour
        return next(
            new ValidationError(
                "Too many OTP requests. Please try again after 1 hour."
            )
        );
    }

    await redis.set(otpRequestKey, optRequests + 1, 'EX', 3600); // Track requests for 1 hour
}

export const sendOtp = async (email: string, name: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify Your Email", template, { name, otp });
    await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // Cooldown of 1 minute (to prevent spamming so that user can't request OTP again within 1 minute)
}

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if(!storedOtp) {
        throw new ValidationError("Invalid or expired OTP.");
    }

    const failedAttemptsKey = `otp_failed_attempts:${email}`;
    let failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

    if(storedOtp !== otp) {
        if(failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800); // Lock for 30 minutes
            await redis.del(`otp:${email}`, failedAttemptsKey); // Reset failed attempts after locking
            throw new ValidationError("Account is temporarily locked due to multiple failed OTP attempts. Please try again after 30 minutes.");
        }
        await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300); // Track failed attempts for 5 minutes
        throw new ValidationError(`Incorrect OTP. You have ${2 - failedAttempts} attempts left.`);
    }

    await redis.del(`otp:${email}`, failedAttemptsKey); // Reset failed attempts on successful verification
}

export const handleForgotPassword = async (
    req: Request, 
    res: Response, 
    next: NextFunction, 
    userType: "user" | "seller"
) => {
    try {
        const { email } = req.body;

        if(!email) return next(new ValidationError("Email is required."));

        const user = userType === "user" && await prisma.users.findUnique({ where: { email } });

        if(!user) {
            return next(new ValidationError(`${userType} account not found.`));
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(email, user.name, "forgot-password-user-mail");

        res.status(200).json({
            success: true,
            message: "OTP sent to your email for password reset. Please check your inbox."
        });
    } catch (error) {
        return next(error);
    }
}

export const verifyForgotPasswordOtp = async (
    req: Request, 
    res: Response, 
    next: NextFunction,
) => {
    try {
        const { email, otp } = req.body;

        if(!email || !otp) {
            return next(new ValidationError("Email and OTP are required."));
        }
        
        await verifyOtp(email, otp, next);

        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password."
        });
    } catch (error) {
        return next(error);
    }
}