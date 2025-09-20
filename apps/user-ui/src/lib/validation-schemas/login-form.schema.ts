import * as z from "zod"

export const LoginFormSchema = z.object({
    email: z.string().email({ message: "Email is required." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    remember_me: z.boolean()
})