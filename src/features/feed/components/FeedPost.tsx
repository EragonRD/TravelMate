import { Trip } from '@/src/features/trips/types';
import { formatDate } from '@/src/utils/date';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeedPostProps {
    trip: Trip;
}

const { width } = Dimensions.get('window');

export const FeedPost = ({ trip }: FeedPostProps) => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>Utilisateur</Text>
                    <Text style={styles.location}>{trip.title}</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="ellipsis-h" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/trips/${trip.id}`)}>
                <Image source={{ uri: trip.image }} style={styles.image} />
            </TouchableOpacity>

            <View style={styles.actions}>
                <View style={styles.leftActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name={trip.isFavorite ? "heart" : "heart-o"} size={24} color={trip.isFavorite ? "red" : "#333"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="comment-o" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome name="paper-plane-o" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="bookmark-o" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.likes}>{Math.floor(Math.random() * 100)} J'aime</Text>
                <Text style={styles.caption}>
                    <Text style={styles.username}>Utilisateur</Text> {trip.title} - {formatDate(trip.startDate)}
                </Text>
                <Text style={styles.timeAgo}>Il y a 2 heures</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    location: {
        fontSize: 12,
        color: '#666',
    },
    image: {
        width: width,
        height: width, // Square image
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    leftActions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginRight: 15,
    },
    footer: {
        paddingHorizontal: 12,
        paddingBottom: 10,
    },
    likes: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    caption: {
        fontSize: 14,
        lineHeight: 18,
    },
    timeAgo: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
});
