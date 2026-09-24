# AARSCAR — Frontend (React.js 18)

Interface utilisateur du système de gestion de location de voitures **AARSCAR**.  
Développée avec **React.js 18**, **Tailwind CSS** et **TanStack React Query**.

---

## ⚙️ Prérequis

- Node.js >= 18
- npm >= 9
- Backend Laravel démarré sur `http://localhost:8000`

---

## 🚀 Installation

### 1. Extraire et accéder au dossier

```bash
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Le fichier `.env` est déjà présent à la racine du projet frontend :

```env
VITE_API_URL=http://localhost:8000/api
```

> ⚠️ Sans ce fichier, l'URL par défaut `http://localhost:8000/api` sera utilisée.

### 4. Démarrer l'application

```bash
npm run dev
```

L'application sera disponible sur : **http://localhost:5173**

---

## 📄 Pages de l'application

| URL | Page | Accès |
|-----|------|-------|
| `/` ou `/Home` | Catalogue des véhicules | Public |
| `/Reservation` | Formulaire de réservation | Public |
| `/Receipt` | Reçu de réservation | Public |
| `/AdminLogin` | Connexion administrateur | Public |
| `/Admin` | Tableau de bord administrateur | 🔒 Token |

---

## 🖥️ Fonctionnalités

### Interface publique (Client)
- Page d'accueil avec hero section animée
- Catalogue des véhicules avec filtres dynamiques (catégorie, marque, année, passagers)
- Modal détail véhicule avec carrousel d'images (façade, arrière, intérieur)
- Sélecteur de durée avec calcul automatique du montant
- Formulaire de réservation complet
- Reçu de réservation imprimable

### Interface administrateur (Back-office)
- Authentification sécurisée (Bearer token Sanctum)
- Tableau de bord avec statistiques en temps réel
- Gestion des véhicules (CRUD + upload 3 images)
- Gestion des clients (CRUD + recherche)
- Gestion des réservations (CRUD + statuts colorisés)
- Gestion des paiements (CRUD)
- Gestion des maintenances (CRUD + gestion statut véhicule automatique)

---

## 🛠️ Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| React.js | 18 | Bibliothèque UI |
| Vite | 5.x | Build tool |
| TanStack React Query | 5.x | Cache et requêtes API |
| Tailwind CSS | 3.x | Styles utilitaires |
| Framer Motion | — | Animations |
| shadcn/ui | — | Composants UI |
| Axios | — | Client HTTP + intercepteurs |
| React Router DOM | 6.x | Navigation SPA |

---

## 📁 Structure du projet

```
src/
├── api/
│   └── axios.js              # Instance Axios + intercepteur Bearer token
├── components/
│   ├── home/                 # HeroSection, Footer
│   ├── vehicles/             # VehicleCard, VehicleFilters, VehicleDetailModal
│   ├── reservation/          # ReservationForm, VehicleSummary
│   └── receipt/              # ReceiptView
├── hooks/
│   └── usePaginatedQuery.js  # Hook pagination + recherche réutilisable
├── lib/
│   └── AuthContext.jsx       # Contexte d'authentification global
├── pages/
│   ├── Home.jsx              # Catalogue public
│   ├── Reservation.jsx       # Formulaire réservation
│   ├── Receipt.jsx           # Reçu imprimable
│   ├── AdminLogin.jsx        # Connexion admin
│   └── Admin.jsx             # Dashboard admin complet
└── pages.config.js           # Routing configuration
```

---

## 🔐 Connexion administrateur

1. Aller sur `http://localhost:5173/AdminLogin`
2. Saisir les identifiants créés via `php artisan tinker` côté backend :
   - Email : `admin@aarscar.ma`
   - Mot de passe : `password123`

---

## 🔧 Build production

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`.

---

## 👩‍💻 Auteur

**Guennouni-Assimi Kaoutar**  
Stage — ISTA Mohamed El Fassi, Errachidia  
Entreprise : AARSCAR, Meknès — 2025/2026