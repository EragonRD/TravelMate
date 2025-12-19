export interface Activity {
    id: number;
    title: string;
    date: string;
    category: string;
    location?: string;
}

export interface Trip {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    destination?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    image?: string;
    activities?: Activity[];
    note?: string;
    isFavorite?: boolean;
    userId?: number;
    user?: User;
}

import { User } from '../../auth/types';

export type CreateTripData = Omit<Trip, 'id' | 'isFavorite'> & { userId?: number };
