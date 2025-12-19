# TravelMate 🌍

Application de gestion de voyages développée avec **React Native** et **Expo**.

Ce projet suit une **Clean Architecture** stricte pour assurer la maintenabilité et la scalabilité.

---

## 🏗️ Architecture du Projet

Le projet est structuré selon les principes de séparation des préoccupations :

```
/src
  /api          # Services HTTP (Configuration Axios, endpoints génériques)
  /features     # Logique métier découpée par domaine fonctionnel
    /auth       # Authentification (Store, Services, Schémas)
    /trips      # Gestion des voyages (Hooks, Composants dédiés)
    /users      # Gestion des utilisateurs
    /settings   # Préférences (Thèmes, Config)
  /ui           # Composants UI réutilisables et sans logique métier (Boutons, Cards...)
  /utils        # Fonctions utilitaires (Dates, Storage...)
/app            # Gestion de la navigation (Expo Router)
  /(tabs)       # Écrans principaux avec barre de navigation
```

---

## ✨ Fonctionnalités

### 🔐 Authentification
- **Inscription & Connexion** (JWT).
- Gestion des erreurs (ex: Email déjà utilisé).
- Persistance de session sécurisée.

### ✈️ Gestion des Voyages
- **Liste des voyages** : Affichage sous forme de liste ou de **Carte Interactive**.
- **Recherche & Filtres** : Recherche instantanée (backend) par titre et filtres par date (À venir, Pasés).
- **CRUD Complet** : Créer, modifier et supprimer ses propres voyages.
- **Détails** : Vue détaillée avec image, dates et activités.

### 📝 Activités & Journal
- **Activités** : Ajouter des étapes au voyage (Lieu, Catégorie, Date).
- **Journal de bord** : Prendre des notes textuelles pour chaque voyage.

### 👤 Profil & Paramètres
- **Profil Utilisateur** : Modification de l'avatar et des infos personnelles.
- **Statistiques** : Nombre de voyages, activités et favoris.
- **Mode Sombre** : Support complet du Dark Mode (Système, Clair, Sombre).

---

## 🚀 Installation & Démarrage

### Option 1 : Démarrage Automatique (Recommandé)
Le script `start.sh` à la racine s'occupe de tout (Lancement Docker + Expo).
```bash
./start.sh
```

### Option 2 : Installation Manuelle

**1. Installer les dépendances :**
```bash
npm install
```

**2. Démarrer le Backend (Docker) :**
```bash
docker-compose up -d --build
```
> L'API sera accessible sur `http://localhost:4000` (ou votre IP locale).

**3. Configurer l'environnement :**
Assurez-vous que le fichier `.env` contient la bonne IP pour `API_URL` (surtout pour test sur mobile).

**4. Lancer l'application :**
```bash
npx expo start
```
- Tapez `a` pour Android.
- Tapez `i` pour iOS.
- Scannez le QR Code avec Expo Go (Android/iOS).

---

### 💡 Décisions Techniques & Architecture

1.  **Architecture (Feature-Based)** :
    *   Le code est organisé par fonctionnalités (`features/auth`, `features/trips`) plutôt que par type de fichier (components, services). Cela permet une meilleure scalabilité et isole le domaine métier.
2.  **Gestion d'État (Zustand)** :
    *   Choisi pour sa simplicité et sa légèreté par rapport à Redux. Utilisé pour l'Authentification (`useAuthStore`) et le Thème (`useThemeStore`).
3.  **UI & Styling** :
    *   Utilisation de composants natifs (`StyleSheet`) avec un système de thème centralisé (`constants/Colors.ts`) pour gérer efficacement le **Dark Mode**.
4.  **Backend (Mock vs Réel)** :
    *   Utilisation de `json-server` pour mocker une API REST complète.
    *   Les services sont prêts à être basculés sur une vraie API en changeant simplement la `BASE_URL`.
5.  **Navigation (Expo Router)** :
    *   Utilisation du routage basé sur les fichiers (semblable à Next.js) pour une structure de navigation intuitive et type-safe.

## 🧪 Tests

```bash
npm test
```
Lance les tests unitaires (Jest) pour vérifier la logique utilitaire (Dates, etc.).
