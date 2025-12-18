import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
