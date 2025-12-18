import client from '@/src/api/client';
import { User } from '@/src/features/auth/types';

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    avatar?: string;
    password?: string;
}

export const updateUser = async (id: number, data: UpdateUserPayload): Promise<User> => {
    // Note: json-server-auth should handle password hashing if configured, 
    // or we might need a specific /600/users/:id endpoint if using that middleware style.
    // Usually standard PATCH /users/:id works with the auth middleware.
    const response = await client.patch<User>(`/users/${id}`, data);
    return response.data;
};
