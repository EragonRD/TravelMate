import client from '@/src/api/client';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('AuthService: login service called');
    try {
        const response = await client.post<AuthResponse>('/login', credentials);
        console.log('AuthService: API response status', response.status);
        console.log('AuthService: API response data', response.data);
        return response.data;
    } catch (e: any) {
        console.error('AuthService: API Error', e);
        if (e.response && e.response.data) {
            // Assuming the backend returns { message: "Error description" } or similar
            const message = typeof e.response.data === 'string'
                ? e.response.data
                : e.response.data.message || 'Une erreur est survenue';
            throw new Error(message);
        }
        throw e;
    }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
        const response = await client.post<AuthResponse>('/register', credentials);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            if (error.response.data === "Email already exists") {
                throw new Error("Cet email est déjà utilisé.");
            }
        }

        if (error.response && error.response.data) {
            const message = typeof error.response.data === 'string'
                ? error.response.data
                : error.response.data.message || 'Une erreur est survenue lors de l\'inscription';
            throw new Error(message);
        }
        throw error;
    }
};
