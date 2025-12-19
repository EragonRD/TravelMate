import { Trip } from '@/src/features/trips/types';
import { TripCard } from '@/src/features/trips/components/TripCard'; // Import
import { useRouter } from 'expo-router';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface TripsMapProps {
    trips: Trip[];
}

export const TripsMap = ({ trips }: TripsMapProps) => {
    const router = useRouter();

    // Default region (Europe)
    const initialRegion = {
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 20,
        longitudeDelta: 20,
    };

    const [selectedTrip, setSelectedTrip] = React.useState<Trip | null>(null);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                onPress={() => setSelectedTrip(null)}
            >
                {trips.filter(t => t.coordinates).map((trip) => (
                    <Marker
                        key={trip.id}
                        coordinate={{
                            latitude: trip.coordinates!.latitude,
                            longitude: trip.coordinates!.longitude,
                        }}
                        onPress={(e) => {
                            e.stopPropagation();
                            setSelectedTrip(trip);
                        }}
                    />
                ))}
            </MapView>

            {selectedTrip && (
                <View style={styles.cardContainer}>
                    <View style={styles.cardWrapper}>
                        <TripCard
                            trip={selectedTrip}
                            onPress={() => router.push(`/trips/${selectedTrip.id}`)}
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedTrip(null)}
                        >
                            <FontAwesome name="times-circle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    cardContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20, // Adjusted back to normal margin as TripCard handles its own internal layout but we want it centered
        right: 20,
    },
    cardWrapper: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
    },
});
