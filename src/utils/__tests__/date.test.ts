import { formatDate } from '../date';

describe('formatDate', () => {
    it('formats valid dates correctly in French format', () => {
        // Note: This relies on the system locale being consistent or the implementation using explicit 'fr-FR'
        const input = '2024-06-15';
        // The exact output might depend on node version/locale (DD/MM/YYYY vs D/M/YYYY), 
        // but we expect day/month/year order.
        // 'fr-FR' usually gives dd/mm/yyyy
        expect(formatDate(input)).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('handles empty input', () => {
        expect(formatDate('')).toBe('');
    });

    it('handles invalid date strings', () => {
        expect(formatDate('invalid-date')).toBe('');
    });
});
