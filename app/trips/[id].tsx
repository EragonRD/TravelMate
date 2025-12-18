import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { ActivityItem } from '@/src/features/trips/components/ActivityItem';
import { ActivityModal } from '@/src/features/trips/components/ActivityModal';
import { ActivitySchema } from '@/src/features/trips/schemas/activitySchema';
import * as tripsService from '@/src/features/trips/services/tripsService';
import { Activity, Trip } from '@/src/features/trips/types';
import { formatDate } from '@/src/utils/date';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TripDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const fetchTrip = async () => {
        try {
            const data = await tripsService.getTripById(Number(id));
            setTrip(data);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger le voyage');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveActivity = async (data: ActivitySchema) => {
        if (!trip) return;

        let updatedActivities = [...(trip.activities || [])];

        if (editingActivity) {
            // Update
            updatedActivities = updatedActivities.map(a =>
                a.id === editingActivity.id ? { ...a, ...data } : a
            );
        } else {
            // Create
            const newActivity: Activity = {
                id: Date.now(), // Mock ID
                ...data,
            };
            updatedActivities.push(newActivity);
        }

        const updatedTrip = { ...trip, activities: updatedActivities };

        try {
            await tripsService.updateTrip(updatedTrip);
            setTrip(updatedTrip);
            setModalVisible(false);
            setEditingActivity(null);
        } catch (e) {
            Alert.alert('Erreur', 'Echec de la sauvegarde');
        }
    };

    const handleDeleteActivity = async (activityId: number) => {
        if (!trip) return;
        Alert.alert('Supprimer', 'Êtes-vous sûr ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: async () => {
                    const updatedActivities = (trip.activities || []).filter(a => a.id !== activityId);
                    const updatedTrip = { ...trip, activities: updatedActivities };
                    try {
                        await tripsService.updateTrip(updatedTrip);
                        setTrip(updatedTrip);
                    } catch (e) {
                        Alert.alert('Erreur', 'Echec de la suppression');
                    }
                }
            }
        ]);
    };

    const openAddModal = () => {
        setEditingActivity(null);
        setModalVisible(true);
    };

    const openEditModal = (activity: Activity) => {
        setEditingActivity(activity);
        setModalVisible(true);
    };

    if (isLoading || !trip) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const toggleFavorite = async () => {
        if (!trip) return;
        const newState = !trip.isFavorite;
        const updatedTrip = { ...trip, isFavorite: newState };
        setTrip(updatedTrip); // Optimistic update
        try {
            await tripsService.updateTrip(updatedTrip);
        } catch (e) {
            setTrip(trip); // Revert
            Alert.alert('Erreur', 'Impossible de mettre en favori');
        }
    };

    const handleShare = async () => {
        if (!trip) return;
        try {
            await Share.share({
                message: `Regarde mon voyage : ${trip.title} du ${formatDate(trip.startDate)} au ${formatDate(trip.endDate)} !`,
            });
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de partager');
        }
    };

    const handleDeleteTrip = async () => {
        if (!trip) return;
        Alert.alert(
            "Supprimer le voyage",
            "Êtes-vous sûr de vouloir supprimer ce voyage ? Cette action est irréversible.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await tripsService.deleteTrip(trip.id);
                            router.replace('/(tabs)');
                        } catch (error) {
                            Alert.alert("Erreur", "Impossible de supprimer le voyage");
                        }
                    }
                }
            ]
        );
    };

    const isOwner = user && trip && user.id === trip.userId;

    return (
        <>
            <Stack.Screen options={{
                title: trip.title,
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isOwner && (
                            <>
                                <TouchableOpacity onPress={() => router.push(`/trips/edit/${trip.id}`)} style={{ marginRight: 15 }}>
                                    <FontAwesome name="pencil" size={24} color="#007AFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDeleteTrip} style={{ marginRight: 15 }}>
                                    <FontAwesome name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity onPress={handleShare} style={{ marginRight: 15 }}>
                            <FontAwesome name="share" size={24} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 15 }}>
                            <FontAwesome name={trip.isFavorite ? "heart" : "heart-o"} size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )
            }} />
            <ScrollView style={styles.container}>
                <Image source={{ uri: trip.image }} style={styles.image} />

                <View style={styles.content}>
                    <Text style={styles.dates}>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </Text>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Activités</Text>
                        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
                            <FontAwesome name="plus" size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    {trip.activities && trip.activities.length > 0 ? (
                        trip.activities.map(activity => (
                            <ActivityItem
                                key={activity.id}
                                activity={activity}
                                onDelete={handleDeleteActivity}
                                onEdit={openEditModal}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>Aucune activité prévue.</Text>
                    )}

                    <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                        <Text style={styles.sectionTitle}>Journal de bord</Text>
                    </View>

                    <TextInput
                        style={styles.journalInput}
                        multiline
                        placeholder="Racontez vos souvenirs..."
                        value={trip.note}
                        onChangeText={(text) => setTrip(prev => prev ? { ...prev, note: text } : null)}
                        onBlur={async () => {
                            if (trip) {
                                try {
                                    await tripsService.updateTrip(trip);
                                } catch (e) {
                                    Alert.alert('Erreur', 'Sauvegarde automatique échouée');
                                }
                            }
                        }}
                    />
                </View>
            </ScrollView>

            <ActivityModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSaveActivity}
                initialData={editingActivity}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
        marginTop: -20,
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    dates: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#888',
    },
    journalInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        height: 150,
        textAlignVertical: 'top',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});
