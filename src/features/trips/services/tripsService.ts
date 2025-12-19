import client from '@/src/api/client';
import { CreateTripData, Trip } from '../types';

export const getTrips = async (query?: string): Promise<Trip[]> => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('_expand', 'user');

    const response = await client.get<Trip[]>(`/trips?${params.toString()}`);
    return response.data;
};

export const getTripById = async (id: number): Promise<Trip> => {
    const response = await client.get<Trip>(`/trips/${id}?_expand=user`);
    return response.data;
};

export const updateTrip = async (trip: Trip): Promise<Trip> => {
    const response = await client.put<Trip>(`/trips/${trip.id}`, trip);
    return response.data;
};

export const createTrip = async (tripData: CreateTripData): Promise<Trip> => {
    const response = await client.post<Trip>('/trips', tripData);
    return response.data;
};

export const deleteTrip = async (id: number): Promise<void> => {
    await client.delete(`/trips/${id}`);
};
