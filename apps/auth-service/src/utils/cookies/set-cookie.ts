import { Response } from 'express';

export const setCookie = (
    res: Response, 
    name: string, 
    value: string
) => {
    res.cookie(
        name, 
        value, 
        {
            httpOnly: true, // Prevents client-side access to the cookie
            secure: true, // Ensures the cookie is sent over HTTPS only
            sameSite: "none", // Allows cross-site requests (important for APIs)
            maxAge: 7 * 60 * 60 * 1000, // 7 days
        }
    );
}