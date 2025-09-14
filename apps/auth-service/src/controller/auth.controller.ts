import { NextFunction, Request, Response } from 'express';
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData } from '../utils/auth.helper';
import prisma from '@packages/libs/prisma';
import { ValidationError } from '@packages/error-handler';


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
