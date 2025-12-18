import { z } from 'zod';

export const activitySchema = z.object({
    title: z.string().min(2, 'Le titre est requis'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide (YYYY-MM-DD)'),
    category: z.string().min(1, 'La catégorie est requise'),
    location: z.string().optional(),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
