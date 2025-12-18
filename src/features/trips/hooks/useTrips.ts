import { useCallback, useEffect, useState } from 'react';
import * as tripsService from '../services/tripsService';
import { Trip } from '../types';

export type TripFilter = 'all' | 'upcoming' | 'past' | 'favorite';

export const useTrips = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<TripFilter>('all');

    const fetchTrips = useCallback(async (query: string = '') => {
        setIsLoading(true);
        try {
            const data = await tripsService.getTrips(query);
            setTrips(data);
        } catch (err) {
            setError('Impossible de charger les voyages');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTrips(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchTrips]);

    // Client-side filtering for Tabs (Date/Favorite)
    useEffect(() => {
        let result = trips;
        const now = new Date();

        if (filter === 'upcoming') {
            result = result.filter(t => new Date(t.startDate) >= now);
        } else if (filter === 'past') {
            result = result.filter(t => new Date(t.endDate) < now);
        } else if (filter === 'favorite') {
            result = result.filter(t => t.isFavorite);
        }

        setFilteredTrips(result);
    }, [trips, filter]);

    return {
        trips: filteredTrips,
        isLoading,
        error,
        refresh: () => fetchTrips(searchQuery),
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
    };
};
