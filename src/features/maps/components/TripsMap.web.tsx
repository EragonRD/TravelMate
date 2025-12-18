import { Trip } from '@/src/features/trips/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TripsMapProps {
    trips: Trip[];
}

export const TripsMap = ({ trips }: TripsMapProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>La carte interactive n'est pas disponible sur la version Web.</Text>
            <Text style={styles.subtext}>Veuillez utiliser l'application mobile pour cette fonctionnalité.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 14,
        color: '#666',
    }
});
