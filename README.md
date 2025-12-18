# TravelMate 🌍

Application de gestion de voyages (React Native + Expo).

## 🚀 Pré-requis

- Node.js & npm
- Docker (pour le mock backend)
- Expo Go sur votre téléphone ou un simulateur (iOS/Android)

## ⚡ Démarrage Rapide

Le script `start.sh` se trouve à la **racine du projet**. Il lance tout pour vous.
```bash
./start.sh
```

## 🛠️ Installation Manuelle

1. **Installer les dépendances Frontend :**
   ```bash
   npm install
   ```

2. **Démarrer le Backend (Mock) :**
   Il est impératif que le backend tourne pour que l'app fonctionne.
   ```bash
   # À la racine du projet
   docker-compose up -d --build
   ```
   *L'API sera accessible sur `http://localhost:4000`.*

3. **Configurer l'environnement :**
   Vérifiez que le fichier `.env` à la racine contient :
   ```
   API_URL=http://localhost:4000
   ```
   *Note : Sur Android Emulator, utilisez `http://10.0.2.2:4000`. Sur un appareil physique, utilisez votre IP locale ex: `http://192.168.1.X:4000`.*

## 📱 Lancer l'Application

```bash
npx expo start
```
- Appuyez sur `i` pour lancer sur simulateur iOS.
- Appuyez sur `a` pour lancer sur émulateur Android.
- Scannez le QR code avec l'app Expo Go pour tester sur votre appareil physique.

## 🧪 Scénario de Test Manuel

### 1. Authentification
- Lancez l'app. Vous devriez être redirigé vers `/auth/login`.
- **Login** : Utilisez `test@test.com` / `123456`.
- **Register** : Créez un nouveau compte.

### 2. Liste des Voyages (Home)
- Vérifiez que la liste des voyages s'affiche.
- **Filtres** : Testez les onglets (Tous, À venir, Passés, Favoris).
- **Recherche** : Tapez "Paris" ou "Bali" dans la barre de recherche.
- **Vue Carte** : Cliquez sur l'icône carte en haut à droite pour voir les marqueurs.

### 3. Détail & Activités
- Cliquez sur un voyage.
- **Favori** : Cliquez sur le cœur en haut à droite. Revenez à la liste pour voir si le filtre "Favoris" fonctionne.
- **Activités** :
    - Cliquez sur `+` pour ajouter une activité.
    - Cliquez sur le crayon pour modifier.
    - Cliquez sur la poubelle pour supprimer.
- **Journal** : Écrivez une note dans la zone de texte en bas et quittez le clavier (le "blur" sauvegarde auto).
- **Partage** : Cliquez sur l'icône de partage en haut à droite.

### 4. Profil
- Allez sur l'onglet Profil (icône bonhomme).
- Vérifiez les stats.
- Changez votre avatar (icône caméra).
- Modifiez votre nom.
- **Déconnexion** : Cliquez sur "Se déconnecter".

## 🐛 Dépannage
- **Erreur Network** : Vérifiez que Docker tourne (`docker ps`). Si vous êtes sur Android, vérifiez l'IP dans `.env`.
