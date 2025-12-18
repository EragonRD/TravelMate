import { formatDate } from '@/src/utils/date';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as tripsService from '../services/tripsService';
import { Trip } from '../types';

interface TripCardProps {
    trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
    const [isFavorite, setIsFavorite] = useState(trip.isFavorite);

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

    return (
        <Link href={`/trips/${trip.id}`} asChild>
            <TouchableOpacity onPress={toggleFavorite}>
                <Animated.View entering={FadeInDown.springify()} style={styles.card}>
                    <Image source={{ uri: trip.image }} style={styles.image} />
                    <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
                        <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color={isFavorite ? "red" : "white"} />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <Text style={styles.title}>{trip.title}</Text>
                        <Text style={styles.dates}>
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 10,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
    },
    favButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dates: {
        fontSize: 14,
        color: '#666',
    },
});
