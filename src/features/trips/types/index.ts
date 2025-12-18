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
    image?: string;
    activities?: Activity[];
    note?: string;
    isFavorite?: boolean;
    userId?: number;
}

export type CreateTripData = Omit<Trip, 'id' | 'isFavorite'> & { userId?: number };
