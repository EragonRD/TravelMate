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
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                    style={styles.avatar}
                />
                <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Explorateur'}</Text>
                <Text style={[styles.email, { color: colors.tabIconDefault }]}>{user?.email}</Text>

                <TouchableOpacity
                    onPress={() => setIsIditing(true)}
                    style={[styles.editButton, { backgroundColor: colors.tint }]}
                >
                    <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.card, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.tint }]}>{stats.tripsCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>{t('profile.stats.trips')}</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.tint }]}>{stats.activitiesCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>{t('profile.stats.activities')}</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.tint }]}>{stats.favoritesCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>{t('profile.stats.favorites')}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.sectionTitleContainer]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.appearance') || 'Préférences'}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.cardBackground, shadowColor: colors.shadow }]}>
                {/* Theme Toggle Wrapper */}
                <View style={styles.settingRow}>
                    <View style={styles.settingLabelContainer}>
                        <FontAwesome name="moon-o" size={20} color={colors.text} style={styles.settingIcon} />
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Thème</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <ThemeToggle minimal={true} />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <TouchableOpacity onPress={toggleLanguage} style={styles.settingRow}>
                    <View style={styles.settingLabelContainer}>
                        <FontAwesome name="globe" size={20} color={colors.text} style={styles.settingIcon} />
                        <Text style={[styles.settingLabel, { color: colors.text }]}>Langue</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: colors.tabIconDefault, marginRight: 8 }}>{locale === 'fr' ? 'Français' : 'English'}</Text>
                        <FontAwesome name="chevron-right" size={14} color={colors.tabIconDefault} />
                    </View>
                </TouchableOpacity>
            </View>

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
        paddingTop: 60,
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
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        marginBottom: 20,
    },
    editButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 1,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    card: {
        width: '100%',
        borderRadius: 16,
        marginBottom: 24,
        padding: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: '60%',
        opacity: 0.2,
    },
    sectionTitleContainer: {
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        opacity: 0.1,
        marginVertical: 4,
    },
    logoutButton: {
        marginTop: 10,
        padding: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    logoutText: {
        color: '#ff4757',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

