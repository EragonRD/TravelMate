import { Trip } from '@/src/features/trips/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

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

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion}>
                {trips.map((trip) => (
                    // Mock coordinates if not present (Real app would have coords in specific Activity or Trip location)
                    // Using random jitter to show multiple markers for demo
                    <Marker
                        key={trip.id}
                        coordinate={{
                            latitude: 48 + (Math.random() * 10 - 5),
                            longitude: 2 + (Math.random() * 10 - 5),
                        }}
                        title={trip.title}
                    >
                        <Callout onPress={() => router.push(`/trips/${trip.id}`)}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{trip.title}</Text>
                                <Text style={styles.calloutSubtitle}>Voir détails</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
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
    callout: {
        padding: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    calloutTitle: {
        fontWeight: 'bold',
    },
    calloutSubtitle: {
        color: '#007AFF',
    }
});
