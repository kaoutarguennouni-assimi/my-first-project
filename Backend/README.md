# AARSCAR — Backend API (Laravel 11)

API RESTful du système de gestion de location de voitures **AARSCAR**.  
Développée avec **Laravel 11** et sécurisée par **Laravel Sanctum**.

---

## ⚙️ Prérequis

- PHP >= 8.2
- Composer
- MySQL (via XAMPP ou autre)
- XAMPP (Apache + MySQL) démarré

---

## 🚀 Installation

### 1. Cloner / extraire le projet

```bash
cd C:/xampp/htdocs
# extraire le zip ici
cd backend
```

### 2. Installer les dépendances

```bash
composer install
```

### 3. Configurer le fichier `.env`

Le fichier `.env` est déjà présent. Vérifier ces valeurs :

```env
APP_NAME=AARSCAR
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aarscar_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Vérifier la clé d'application

Le fichier `.env` contient déjà une `APP_KEY` valide.  
Si elle est absente ou vide, générez-en une nouvelle :

```bash
php artisan key:generate
```

### 5. Créer la base de données

Dans **phpMyAdmin** → créer une base de données nommée `aarscar_db`.

### 6. Lancer les migrations

```bash
php artisan migrate
```

### 7. (Optionnel) Insérer les données de test

```bash
php artisan db:seed
```

### 8. Créer le lien de stockage pour les images

```bash
php artisan storage:link
```

### 9. Démarrer le serveur

```bash
php artisan serve
```

L'API sera disponible sur : **http://localhost:8000/api**

---

## 🔐 Authentification

L'API utilise **Laravel Sanctum** avec des **Bearer tokens**.

### Créer un compte administrateur

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name'     => 'Admin AARSCAR',
    'email'    => 'admin@aarscar.ma',
    'password' => bcrypt('password123'),
    'role'     => 'admin',
]);
```

---

## 📡 Endpoints principaux

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Connexion administrateur |
| GET | `/api/vehicules` | Public | Liste des véhicules |
| POST | `/api/reservations` | Public | Créer une réservation |
| GET | `/api/dashboard` | 🔒 Token | Statistiques globales |
| POST | `/api/vehicules` | 🔒 Token | Ajouter un véhicule |
| GET | `/api/clients` | 🔒 Token | Liste des clients |
| GET | `/api/paiements` | 🔒 Token | Liste des paiements |
| GET | `/api/maintenances` | 🔒 Token | Liste des maintenances |

> API complète : 30 endpoints documentés dans le rapport de stage.

---

## 🗄️ Structure de la base de données

6 tables principales :

- `users` — Administrateurs
- `clients` — Clients (CIN unique, permis unique)
- `vehicules` — Parc automobile (3 images)
- `reservations` — Contrats de location
- `paiements` — Règlements
- `maintenances` — Entretiens véhicules

---

## 🛠️ Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| Laravel | 11 | Framework PHP — API REST |
| Laravel Sanctum | 4.x | Authentification par tokens |
| MySQL | 8.x | Base de données |
| Eloquent ORM | — | Gestion des modèles |

---

## 📁 Structure du projet

```
app/
├── Http/
│   ├── Controllers/     # AuthController, VehiculeController, ...
│   └── Resources/       # API Resources (formatage JSON)
├── Models/              # Client, Vehicule, Reservation, ...
database/
├── migrations/          # Structure des tables
└── seeders/             # Données de test
routes/
└── api.php              # Toutes les routes API
```

---

## 👩‍💻 Auteur

**Guennouni-Assimi Kaoutar**  
Stage — ISTA Mohamed El Fassi, Errachidia  
Entreprise : AARSCAR, Meknès — 2025/2026