import { Trip } from '@/src/features/trips/types';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StoriesProps {
    trips: Trip[];
}

export const Stories = ({ trips }: StoriesProps) => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.storyItem}>
                    <View style={[styles.avatarContainer, styles.myStory]}>
                        <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.avatar} />
                        <View style={styles.addIcon}>
                            <Text style={styles.addIconText}>+</Text>
                        </View>
                    </View>
                    <Text style={styles.username}>Ma story</Text>
                </TouchableOpacity>

                {trips.map((trip) => (
                    <TouchableOpacity key={trip.id} style={styles.storyItem}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: trip.image || 'https://via.placeholder.com/60' }} style={styles.avatar} />
                        </View>
                        <Text style={styles.username} numberOfLines={1}>{trip.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 10,
        backgroundColor: '#fff',
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
        borderColor: 'transparent',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    username: {
        fontSize: 11,
        color: '#333',
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
