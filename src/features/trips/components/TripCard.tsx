import { formatDate } from '@/src/utils/date';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as tripsService from '../services/tripsService';
import { Trip } from '../types';

import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface TripCardProps {
    trip: Trip;
    onPress?: () => void; // Allow custom press handler (for Map reuse)
    containerStyle?: any; // Allow style overrides
}

export const TripCard = ({ trip, onPress, containerStyle }: TripCardProps) => {
    const [isFavorite, setIsFavorite] = useState(trip.isFavorite);
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const cardColor = Colors[theme].cardBackground;
    const textColor = Colors[theme].text;

    const toggleFavorite = async () => {
        const newState = !isFavorite;
        setIsFavorite(newState);
        try {
            await tripsService.updateTrip({ ...trip, isFavorite: newState });
        } catch (e) {
            setIsFavorite(!newState); // Revert
            Alert.alert('Erreur', 'Impossible de mettre en favori');
        }
    };

    const CardContent = (
        <Animated.View entering={FadeInDown.springify()} style={[styles.card, { backgroundColor: cardColor }, containerStyle]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: trip.image }} style={styles.image} />
                <View style={styles.overlay} />
                <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
                    <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={22} color={isFavorite ? "#ff4757" : "white"} />
                </TouchableOpacity>
                <View style={styles.imageContent}>
                    <Text style={styles.title} numberOfLines={1}>{trip.title}</Text>
                    {trip.user?.name && (
                        <Text style={styles.author}>Par {trip.user.name}</Text>
                    )}
                    {trip.destination && (
                        <View style={styles.locationContainer}>
                            <FontAwesome name="map-marker" size={14} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.locationText} numberOfLines={1}>{trip.destination}</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.dateContainer}>
                    <FontAwesome name="calendar" size={14} color={theme === 'dark' ? '#aaa' : '#666'} style={{ marginRight: 6 }} />
                    <Text style={[styles.dates, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </Text>
                </View>
                <FontAwesome name="chevron-right" size={14} color="#ccc" />
            </View>
        </Animated.View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return (
        <Link href={`/trips/${trip.id}`} asChild>
            <TouchableOpacity activeOpacity={0.9}>
                {CardContent}
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginVertical: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    favButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 8,
        backdropFilter: 'blur(10px)',
    },
    imageContent: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        marginBottom: 4,
    },
    author: {
        fontSize: 12,
        color: '#eee',
        fontWeight: '600',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#f0f0f0',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dates: {
        fontSize: 14,
        fontWeight: '500',
    },
});
