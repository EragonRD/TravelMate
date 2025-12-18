
import { getItem, saveItem } from '@/src/utils/storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
    loadTheme: () => Promise<void>;
    getEffectiveColorScheme: () => ColorSchemeName;
}

const STORAGE_KEY = 'theme_mode';

export const useThemeStore = create<ThemeState>((set, get) => ({
    themeMode: 'system',

    setThemeMode: async (mode: ThemeMode) => {
        set({ themeMode: mode });
        await saveItem(STORAGE_KEY, mode);
    },

    loadTheme: async () => {
        const savedMode = await getItem(STORAGE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
            set({ themeMode: savedMode as ThemeMode });
        }
    },

    getEffectiveColorScheme: () => {
        const { themeMode } = get();
        if (themeMode === 'system') {
            return Appearance.getColorScheme();
        }
        return themeMode;
    },
}));
