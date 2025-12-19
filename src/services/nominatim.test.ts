
import { searchCity } from './nominatim';

// Mock fetch
global.fetch = jest.fn();

describe('nominatim service', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('returns empty array for short query', async () => {
        const results = await searchCity('Pa');
        expect(results).toEqual([]);
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('fetches data successfully', async () => {
        const mockResults = [
            {
                place_id: 123,
                display_name: 'Paris, France',
                lat: '48.8566',
                lon: '2.3522',
            },
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResults,
        });

        const results = await searchCity('Paris');
        expect(results).toEqual(mockResults);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('handles network error gracefully', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const results = await searchCity('Paris');
        expect(results).toEqual([]);
    });
});
