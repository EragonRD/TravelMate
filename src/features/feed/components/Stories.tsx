import { Trip } from '@/src/features/trips/types';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeStore } from '@/src/features/settings/stores/useThemeStore';

interface StoriesProps {
    trips: Trip[];
}

export const Stories = ({ trips }: StoriesProps) => {
    const { getEffectiveColorScheme } = useThemeStore();
    const theme = getEffectiveColorScheme() ?? 'light';
    const backgroundColor = Colors[theme].cardBackground;
    const textColor = Colors[theme].text;
    const borderColor = theme === 'dark' ? '#333' : '#eee';

    return (
        <View style={[styles.container, { backgroundColor, borderBottomColor: borderColor }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.storyItem}>
                    <View style={[styles.avatarContainer, styles.myStory, { borderColor: borderColor }]}>
                        <Image source={{ uri: 'https://via.placeholder.com/60' }} style={[styles.avatar, { borderColor: borderColor }]} />
                        <View style={styles.addIcon}>
                            <Text style={styles.addIconText}>+</Text>
                        </View>
                    </View>
                    <Text style={[styles.username, { color: textColor }]}>Ma story</Text>
                </TouchableOpacity>

                {trips.map((trip) => (
                    <TouchableOpacity key={trip.id} style={styles.storyItem}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: trip.image || 'https://via.placeholder.com/60' }} style={[styles.avatar, { borderColor: borderColor }]} />
                        </View>
                        <Text style={[styles.username, { color: textColor }]} numberOfLines={1}>{trip.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    scrollContent: {
        paddingHorizontal: 15,
    },
    storyItem: {
        alignItems: 'center',
        marginRight: 15,
        width: 70,
    },
    avatarContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        padding: 3,
        borderColor: '#C13584', // Instagram gradient color substitute
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    myStory: {
        borderWidth: 0,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
    },
    username: {
        fontSize: 11,
    },
    addIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    addIconText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: -2,
    },
});
