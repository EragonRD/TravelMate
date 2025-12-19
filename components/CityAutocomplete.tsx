
import { NominatimResult, searchCity } from '@/src/services/nominatim';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from './Themed';
import { useThemeStore } from '@/src/features/settings/stores/useThemeStore';

interface CityAutocompleteProps {
    onSelect: (city: string, coordinates: { latitude: number; longitude: number }) => void;
    defaultValue?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
}

export default function CityAutocomplete({ onSelect, defaultValue = '', placeholder = 'Rechercher une ville...', onChangeText, value }: CityAutocompleteProps) {
    const [query, setQuery] = useState(defaultValue);

    // Sync with external value if provided
    useEffect(() => {
        if (value !== undefined && value !== query) {
            setQuery(value);
        }
    }, [value]);

    const [results, setResults] = useState<NominatimResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const { getEffectiveColorScheme } = useThemeStore();
    const theme = getEffectiveColorScheme() ?? 'light';
    const inputBg = theme === 'dark' ? '#1c1c1e' : '#f9f9f9';
    const inputBorder = theme === 'dark' ? '#333' : '#ddd';
    const textColor = useThemeColor({}, 'text');

    const placeholderColor = theme === 'dark' ? '#999' : '#888';
    const borderColor = theme === 'dark' ? '#333' : '#ddd';
    const separatorColor = theme === 'dark' ? '#333' : '#ccc';

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 3) {
                setLoading(true);
                const data = await searchCity(query);
                setResults(data);
                setLoading(false);
                setShowResults(true);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (item: NominatimResult) => {
        const cityName = item.display_name.split(',')[0];
        setQuery(cityName); // Keep just the city name or full name? User choice. Let's keep it simple.
        // Actually for the input display, better to show what they clicked, or maybe just "City, Country"
        // Let's use display_name for now but maybe truncated
        setQuery(item.display_name);
        // Hide results immediately after selection
        setShowResults(false);
        setResults([]); // Clear results to prevent flashing if reopened
        onSelect(item.display_name, {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
        });
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                <FontAwesome name="search" size={16} color={placeholderColor} style={styles.icon} />
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        if (onChangeText) onChangeText(text);
                        // If user clears, maybe reset selection?
                        // If user types manually, onSelect isn't called until click.
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                />
                {loading && <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />}
            </View>

            {showResults && results.length > 0 && (
                <View style={[styles.resultsList, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                        {results.map((item) => (
                            <TouchableOpacity
                                key={item.place_id}
                                style={[styles.item, { borderBottomColor: separatorColor }]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[styles.itemText, { color: textColor }]}>{item.display_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1, // Ensure dropdown is on top
        position: 'relative',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
    },
    loader: {
        marginLeft: 10,
    },
    resultsList: {
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderRadius: 10,
        maxHeight: 200,
        zIndex: 1000,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    item: {
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    itemText: {
        fontSize: 14,
    },
});
