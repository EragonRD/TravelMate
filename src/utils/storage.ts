import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const saveItem = async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, value);
        }
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

export const getItem = async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

export const deleteItem = async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};
