import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { ThemeToggle } from '@/src/features/settings/components/ThemeToggle';
import { useTrips } from '@/src/features/trips/hooks/useTrips';
import { ProfileEditModal } from '@/src/features/users/components/ProfileEditModal';
import { useTranslation } from '@/src/i18n/I18nContext';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { trips } = useTrips();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { t, locale, setLocale } = useTranslation();

    const [isIditing, setIsIditing] = useState(false);

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

    const toggleLanguage = () => {
        setLocale(locale === 'fr' ? 'en' : 'fr');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.name || 'Explorateur'}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <TouchableOpacity
                    onPress={() => setIsIditing(true)}
                    style={[styles.editButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                >
                    <Text style={[styles.editButtonText, { color: colors.text }]}>{t('profile.edit')}</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.statsContainer, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.tripsCount}</Text>
                    <Text style={styles.statLabel}>{t('profile.stats.trips')}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.activitiesCount}</Text>
                    <Text style={styles.statLabel}>{t('profile.stats.activities')}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.favoritesCount}</Text>
                    <Text style={styles.statLabel}>{t('profile.stats.favorites')}</Text>
                </View>
            </View>

            <ThemeToggle />

            <TouchableOpacity onPress={toggleLanguage} style={[styles.langButton, { borderColor: colors.border }]}>
                <Text style={{ color: colors.text }}>Language: {locale.toUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>{t('profile.logout')}</Text>
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
        paddingTop: 60, // Safe area
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        backgroundColor: '#e1e4e8',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    editButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 25,
        borderWidth: 1,
    },
    editButtonText: {
        fontWeight: '600',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
    },
    logoutButton: {
        marginTop: 20,
        padding: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: '#ff4757',
        fontWeight: 'bold',
        fontSize: 16,
    },
    langButton: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 10,
    }
});
