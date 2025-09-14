import crypto from 'crypto';
import { ValidationError } from '@packages/error-handler';
import { NextFunction } from 'express';
import redis from '@packages/libs/redis';
import { sendEmail } from './sendMail';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g; // Simple email regex for validation

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
        console.log(email)
        throw new ValidationError("Invalid email format.");
    }
}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    const isOtpLocked = await redis.get(`otp_lock:${email}`);
    if(isOtpLocked) {
        return next(
            new ValidationError(
                "Account is temporarily locked due to multiple failed OTP attempts. Please try again after 30 minutes."
            )
        );
    }

    const isOtpSpamLocked = await redis.get(`otp_spam_lock:${email}`);
    if(isOtpSpamLocked) {
        return next(
            new ValidationError(
                "Too many OTP requests. Please try again after 1 hour."
            )
        );
    }

    const isOtpCooldown = await redis.get(`otp_cooldown:${email}`);
    if(isOtpCooldown) {
        return next(
            new ValidationError(
                "OTP already sent. Please wait 1 minute before requesting a new OTP."
            )
        );
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