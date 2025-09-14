import { NextFunction, Request, Response } from 'express';
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from '../utils/auth.helper';
import prisma from '@packages/libs/prisma';
import { ValidationError } from '@packages/error-handler';
import bcrypt from 'bcryptjs';


// Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "user");
        const { email, name } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return next(new ValidationError("User with this email already exists."));
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(email, name, "user-activation-mail");

        res.status(200).json({ 
            message: "Registration successful. Please check your email for the OTP to activate your account." 
        });
    } catch (error) {
        return next(error);
    }
}

// Verify user with OTP
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;

        if (!email || !otp || !password || !name) {
            return next(new ValidationError("All fields are required."));
        }
        
        const existingUser = await prisma.users.findUnique({ where: { email } });

        if(existingUser) {
            return next(new ValidationError("User with this email already exists."));
        }

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        res.status(201).json({
            success: true,
            message: "User verified and account created successfully.",
        });

    } catch (error) {
        return next(error);
    }
}
