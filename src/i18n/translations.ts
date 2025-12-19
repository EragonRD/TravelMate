export const translations = {
    fr: {
        greeting: {
            morning: "Bonjour",
            evening: "Bonsoir",
        },
        home: {
            searchPlaceholder: "Où souhaitez-vous aller ?",
            tabs: {
                all: "Tous",
                upcoming: "À venir",
                past: "Passés",
                favorite: "Favoris",
            },
            empty: "Aucun voyage trouvé",
        },
        profile: {
            title: "Mon Profil",
            edit: "Modifier le profil",
            stats: {
                trips: "Voyages",
                activities: "Activités",
                favorites: "Favoris",
            },
            logout: "Se déconnecter",
        },
        trips: {
            createConfig: {
                title: "Nouveau voyage",
            }
        }
    },
    en: {
        greeting: {
            morning: "Good morning",
            evening: "Good evening",
        },
        home: {
            searchPlaceholder: "Where do you want to go?",
            tabs: {
                all: "All",
                upcoming: "Upcoming",
                past: "Past",
                favorite: "Favorites",
            },
            empty: "No trips found",
        },
        profile: {
            title: "My Profile",
            edit: "Edit Profile",
            stats: {
                trips: "Trips",
                activities: "Activities",
                favorites: "Favorites",
            },
            logout: "Logout",
        },
        trips: {
            createConfig: {
                title: "New Trip",
            }
        }
    },
};

export type Locale = 'fr' | 'en';
export type TranslationKey = string; // Simplified for custom hook usage, deeper typing can be added if needed
