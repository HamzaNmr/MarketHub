import { NextFunction, Request, Response } from 'express';
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from '../utils/auth.helper';
import prisma from '@market-hub/packages/libs/prisma';
import { AuthenticationError, ValidationError } from '@market-hub/packages/error-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from '../utils/cookies/set-cookie';


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
            success: true,
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

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required."));
        }

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return next(new AuthenticationError("User not found."));

        // Check if password is matched
        const isMatchPassword = await bcrypt.compare(password, user.password!);
        if (!isMatchPassword) {
            return next(new AuthenticationError("Invalid credentials."));
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign(
            { userId: user.id, role: "user" },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
            }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, role: "user" },
            process.env.REFRESH_TOKEN_SECRET as string,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
            }
        );

        // Store access and refresh tokens in httpOnly secure cookies
        setCookie(res, 'access_token', accessToken);
        setCookie(res, 'refresh_token', refreshToken); 
        
        res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        });
        
    } catch (error) {
        return next(error);
    }
}


export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, "user");
}

export const verifyUserForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
}

export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return next(new ValidationError("Email and new password are required."));
        }

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return next(new ValidationError("User not found."));

        const isSamePassword = await bcrypt.compare(newPassword, user.password!);
        if (isSamePassword) {
            return next(new ValidationError("New password must be different from the old password."));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.status(200).json({
            success: true,
            message: "Password reset successful. You can now log in with your new password."
        });
    } catch (error) {
        return next(error);
    }
}