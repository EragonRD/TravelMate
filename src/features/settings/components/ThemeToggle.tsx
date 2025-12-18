
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../stores/useThemeStore';

export function ThemeToggle() {
    const { themeMode, setThemeMode } = useThemeStore();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const options = [
        { label: 'Système', value: 'system' },
        { label: 'Clair', value: 'light' },
        { label: 'Sombre', value: 'dark' },
    ] as const;

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Apparence</Text>
            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionButton,
                            themeMode === option.value && { backgroundColor: colors.tint },
                            { borderColor: colors.border }
                        ]}
                        onPress={() => setThemeMode(option.value)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                { color: themeMode === option.value ? '#fff' : colors.text }
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        marginHorizontal: 4,
    },
    optionText: {
        fontWeight: '600',
    },
});
