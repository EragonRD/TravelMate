import { Text, View } from '@/components/Themed';
import { TripsMap } from '@/src/features/maps/components/TripsMap';
import { TripCard } from '@/src/features/trips/components/TripCard';
import { TripFilter, useTrips } from '@/src/features/trips/hooks/useTrips';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { trips, isLoading, refresh, searchQuery, setSearchQuery, filter, setFilter } = useTrips();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const FILTER_OPTIONS: { label: string; value: TripFilter }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'À venir', value: 'upcoming' },
    { label: 'Passés', value: 'past' },
    { label: 'Favoris', value: 'favorite' },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar & View Toggle */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un voyage..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
        >
          <FontAwesome name={viewMode === 'list' ? 'map' : 'list'} size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.filterTab, filter === option.value && styles.activeFilterTab]}
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
        />
      ) : (
        <TripsMap trips={trips} />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/trips/create')}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  searchContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 8,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 100,
  },
});
