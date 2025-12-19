import { TripCard } from '@/src/features/trips/components/TripCard';
import { useTrips } from '@/src/features/trips/hooks/useTrips';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, useColorScheme, View as DefaultView, Text as DefaultText } from 'react-native';
import { View, Text, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function SearchScreen() {
    const { trips, isLoading, searchQuery, setSearchQuery } = useTrips();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const placeholderColor = theme === 'dark' ? '#888' : '#666';
    const inputBgStr = '#f0f0f0'; // Always light background for search bar
    const searchTextColor = '#000'; // Always black text
    const searchPlaceholderColor = '#666'; // Always dark grey placeholder

    return (
        <View style={styles.container}>
            <View style={[styles.header, { borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
                <View style={[styles.searchBar, { backgroundColor: inputBgStr }]}>
                    <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: searchTextColor }]}
                        placeholder="Rechercher un voyage..."
                        placeholderTextColor={searchPlaceholderColor}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                    />
                    {searchQuery.length > 0 && (
                        <FontAwesome
                            name="times-circle"
                            size={20}
                            color="#888"
                            onPress={() => setSearchQuery('')}
                        />
                    )}
                </View>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TripCard trip={item} />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <FontAwesome name="search" size={50} color={theme === 'dark' ? '#333' : '#ddd'} />
                        </View>
                    }
                    style={{ backgroundColor: backgroundColor }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60, // Safe area
        borderBottomWidth: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});
