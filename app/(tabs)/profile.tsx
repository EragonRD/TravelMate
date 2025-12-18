import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { ThemeToggle } from '@/src/features/settings/components/ThemeToggle';
import { useTrips } from '@/src/features/trips/hooks/useTrips';
import { ProfileEditModal } from '@/src/features/users/components/ProfileEditModal';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { trips } = useTrips();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [isIditing, setIsIditing] = useState(false);

    // ... (rest of stats memo) ...

    const stats = useMemo(() => {
        const tripsCount = trips.length;
        const activitiesCount = trips.reduce((acc, trip) => acc + (trip.activities?.length || 0), 0);
        const favoritesCount = trips.filter(trip => trip.isFavorite).length;
        return { tripsCount, activitiesCount, favoritesCount };
    }, [trips]);

    const handleLogout = async () => {
        await logout();
        router.replace('/auth/login');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Mon Profil</Text>

            <View style={styles.header}>
                <Image source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                <Text style={styles.name}>{user?.name || 'Utilisateur'}</Text>
                <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>

                <TouchableOpacity
                    onPress={() => setIsIditing(true)}
                    style={[styles.editButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                >
                    <Text style={[styles.editButtonText, { color: colors.text }]}>Modifier le profil</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.tripsCount}</Text>
                    <Text style={styles.statLabel}>Voyages</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.activitiesCount}</Text>
                    <Text style={styles.statLabel}>Activités</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.favoritesCount}</Text>
                    <Text style={styles.statLabel}>Favoris</Text>
                </View>
            </View>

            <ThemeToggle />

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>

            <ProfileEditModal
                visible={isIditing}
                onClose={() => setIsIditing(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    editButtonText: {
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 15,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        color: '#666',
        fontSize: 14,
    },
    logoutButton: {
        marginTop: 'auto',
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
