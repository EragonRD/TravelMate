import client from '@/src/api/client';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('AuthService: login service called');
    try {
        const response = await client.post<AuthResponse>('/login', credentials);
        console.log('AuthService: API response status', response.status);
        console.log('AuthService: API response data', response.data);
        return response.data;
    } catch (e) {
        console.error('AuthService: API Error', e);
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
        throw error;
    }
};
