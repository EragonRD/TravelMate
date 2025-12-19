import * as usersService from '@/src/features/users/services/usersService';
import { deleteItem, getItem, saveItem } from '@/src/utils/storage';
import { create } from 'zustand';
import * as authService from '../services/authService';
import { LoginCredentials, RegisterCredentials, User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isSessionLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    loadSession: () => Promise<void>;
    updateProfile: (data: Partial<User> & { password?: string }) => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isSessionLoading: true,
    error: null, // Initial state for error

    login: async (credentials) => {
        console.log('AuthStore: login action started', credentials);
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(credentials);
            console.log('AuthStore: login response received', response);

            const { accessToken, user } = response;

            // Save to storage
            console.log('AuthStore: Saving token to storage');
            await saveItem(TOKEN_KEY, accessToken);
            if (user) {
                await saveItem(USER_KEY, JSON.stringify(user));
            }

            set({ user, token: accessToken, isLoading: false });
            console.log('AuthStore: State updated');
        } catch (error) {
            console.error('AuthStore: Login failed', error);
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    register: async (credentials) => {
        set({ isLoading: true });
        try {
            const response = await authService.register(credentials);
            await saveItem(TOKEN_KEY, response.accessToken);
            await saveItem(USER_KEY, JSON.stringify(response.user));
            set({ user: response.user, token: response.accessToken, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        await deleteItem(TOKEN_KEY);
        await deleteItem(USER_KEY);
        set({ user: null, token: null });
    },

    loadSession: async () => {
        set({ isSessionLoading: true });
        try {
            const token = await getItem(TOKEN_KEY);
            const userStr = await getItem(USER_KEY);

            if (token && userStr) {
                set({ token, user: JSON.parse(userStr), isSessionLoading: false });
            } else {
                set({ user: null, token: null, isSessionLoading: false });
            }
        } catch (error) {
            set({ user: null, token: null, isSessionLoading: false });
        }
    },
    updateProfile: async (data: Partial<User> & { password?: string }) => {
        set({ isLoading: true, error: null });
        try {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) throw new Error("No user logged in");

            const updatedUser = await usersService.updateUser(currentUser.id, data);

            // Update storage
            await saveItem(USER_KEY, JSON.stringify(updatedUser)); // Note: existing token remains valid

            set({ user: updatedUser, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },
}));
