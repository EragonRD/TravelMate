import { View, Text, useThemeColor } from '@/components/Themed';
import { TripsMap } from '@/src/features/maps/components/TripsMap';
import { TripCard } from '@/src/features/trips/components/TripCard';
import { TripFilter, useTrips } from '@/src/features/trips/hooks/useTrips';
import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity, Image, Platform, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { usePushNotifications } from '@/src/hooks/usePushNotifications';

export default function HomeScreen() {
  const router = useRouter();
  const { trips, isLoading, refresh, searchQuery, setSearchQuery, filter, setFilter } = useTrips();
  const { user } = useAuthStore();
  const { requestPermissions } = usePushNotifications();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const inputBg = '#f0f0f0'; // Always light background to match Search screen
  const searchTextColor = '#000'; // Always black text
  const searchPlaceholderColor = '#666'; // Always dark grey placeholder

  const FILTER_OPTIONS: { label: string; value: TripFilter }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'À venir', value: 'upcoming' },
    { label: 'Passés', value: 'past' },
    { label: 'Favoris', value: 'favorite' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 18 ? 'Bonjour' : 'Bonsoir';
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor }]}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.name || 'Explorateur'}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <TouchableOpacity onPress={requestPermissions}>
            <FontAwesome name="bell-o" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/(tabs)/profile')}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.headerAvatar}
                resizeMode="cover"
              />
            ) : (
              <FontAwesome name="user-circle" size={40} color="#007AFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Toggle */}
      <View style={[styles.searchSection, { backgroundColor }]}>
        <View style={[styles.searchContainer, { backgroundColor: inputBg }]}>
          <FontAwesome name="search" size={16} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: searchTextColor }]}
            placeholder="Où souhaitez-vous aller ?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={searchPlaceholderColor}
          />
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: inputBg }, viewMode === 'map' && styles.activeToggle]}
          onPress={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
        >
          <FontAwesome name={viewMode === 'list' ? 'map' : 'list'} size={20} color={viewMode === 'map' ? "#fff" : "#007AFF"} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filtersContainer, { backgroundColor }]}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterTab,
              { backgroundColor: inputBg },
              filter === option.value && styles.activeFilterTab
            ]}
            onPress={() => setFilter(option.value)}
          >
            <Text style={[styles.filterText, filter === option.value && styles.activeFilterText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TripCard trip={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>Aucun voyage trouvé</Text>
            </View>
          }
          style={{ backgroundColor }}
        />
      ) : (
        <TripsMap trips={trips} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Safe Area
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 22,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  toggleButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    color: '#888',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  center: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },

});
