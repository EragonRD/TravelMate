
import React from 'react';
import CityAutocomplete from './CityAutocomplete';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as NominatimService from '@/src/services/nominatim';

// Mock the service
jest.mock('@/src/services/nominatim');

describe('CityAutocomplete', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText } = render(<CityAutocomplete onSelect={jest.fn()} />);
        expect(getByPlaceholderText('Rechercher une ville...')).toBeTruthy();
    });

    it('triggers search on input', async () => {
        // Mock search response
        (NominatimService.searchCity as jest.Mock).mockResolvedValue([
            { place_id: 1, display_name: 'Paris, France', lat: '48.85', lon: '2.35' }
        ]);

        const { getByPlaceholderText, getByText } = render(<CityAutocomplete onSelect={jest.fn()} />);
        const input = getByPlaceholderText('Rechercher une ville...');

        fireEvent.changeText(input, 'Paris');

        // Wait for debounce and effect
        await waitFor(() => {
            expect(NominatimService.searchCity).toHaveBeenCalledWith('Paris');
        }, { timeout: 1000 });

        await waitFor(() => {
            expect(getByText('Paris, France')).toBeTruthy();
        });
    });

    it('calls onSelect when item is clicked', async () => {
        (NominatimService.searchCity as jest.Mock).mockResolvedValue([
            { place_id: 1, display_name: 'Lyon, France', lat: '45.75', lon: '4.85' }
        ]);

        const onSelectMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(<CityAutocomplete onSelect={onSelectMock} />);
        const input = getByPlaceholderText('Rechercher une ville...');

        fireEvent.changeText(input, 'Lyon');

        await waitFor(() => expect(getByText('Lyon, France')).toBeTruthy());

        fireEvent.press(getByText('Lyon, France'));

        expect(onSelectMock).toHaveBeenCalledWith('Lyon, France', {
            latitude: 45.75,
            longitude: 4.85
        });
    });
});
