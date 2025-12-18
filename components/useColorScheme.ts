import { useThemeStore } from '@/src/features/settings/stores/useThemeStore';

export function useColorScheme() {
    const { getEffectiveColorScheme } = useThemeStore();
    return getEffectiveColorScheme();
}
