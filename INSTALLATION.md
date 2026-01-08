# Guide d'Installation - Plateforme Prix de l'Innovation MEF

## Prérequis

- Node.js 18+ et npm 9+
- PostgreSQL 15+
- Docker et Docker Compose (optionnel, pour le déploiement)

## Installation avec Docker (Recommandé)

1. Clonez le dépôt
```bash
git clone <repository-url>
cd prixddi
```

2. Configurez les variables d'environnement
```bash
cp .env.example .env
# Éditez .env avec vos configurations
```

3. Lancez les services avec Docker Compose
```bash
docker-compose up -d
```

L'application sera accessible sur :
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- PostgreSQL: localhost:5432

## Installation manuelle

### 1. Installation des dépendances

```bash
# À la racine
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configuration de la base de données

1. Créez une base de données PostgreSQL :
```sql
CREATE DATABASE prixddi_db;
```

2. Configurez les variables d'environnement :
```bash
# Backend
cd backend
cp .env.example .env
# Éditez .env avec vos paramètres de base de données
```

3. Exécutez les migrations :
```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 3. Démarrage de l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Création du premier utilisateur administrateur

Après avoir lancé les migrations et seeders, vous pouvez créer un utilisateur via l'API ou directement en base de données.

### Via l'API (après connexion en tant que super_admin)

```bash
POST /api/utilisateurs
{
  "nom": "Admin",
  "prenom": "Super",
  "email": "admin@mef.gov.bf",
  "mot_de_passe": "votre_mot_de_passe",
  "role_id": 3  // super_admin
}
```

## Structure du projet

```
prixddi/
├── backend/          # API Node.js/Express
│   ├── config/       # Configuration base de données
│   ├── controllers/  # Contrôleurs
│   ├── middleware/   # Middlewares (auth, upload, etc.)
│   ├── models/       # Modèles Sequelize
│   ├── routes/       # Routes API
│   ├── migrations/   # Migrations base de données
│   ├── seeders/      # Seeders
│   └── uploads/      # Fichiers uploadés
├── frontend/         # Application React/Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── contexts/
└── docker-compose.yml
```

## Scripts disponibles

### Backend
- `npm run dev` : Démarre le serveur en mode développement
- `npm start` : Démarre le serveur en mode production
- `npm run db:migrate` : Exécute les migrations
- `npm run db:seed` : Exécute les seeders

### Frontend
- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Build pour la production
- `npm run preview` : Prévisualise le build de production

## Variables d'environnement importantes

### Backend (.env)
- `DB_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Secret pour les tokens JWT
- `PORT` : Port du serveur backend (défaut: 3000)
- `HOST` : Adresse IP/hostname sur laquelle écouter (défaut: 0.0.0.0 pour toutes les interfaces)
- `FRONTEND_URL` : URL du frontend pour CORS

### Frontend
- `VITE_API_URL` : URL de l'API backend (défaut: http://localhost:3000)
- `VITE_HOST` : Adresse IP/hostname sur laquelle écouter (défaut: 0.0.0.0 pour toutes les interfaces)
- `VITE_PORT` : Port du serveur frontend (défaut: 5173)

### Configuration pour accès réseau

Pour permettre l'accès depuis d'autres machines sur le réseau :

**Backend :**
```bash
# Dans backend/.env
HOST=0.0.0.0  # Écoute sur toutes les interfaces réseau
PORT=3000
```

**Frontend :**
```bash
# Dans frontend/.env ou via variables d'environnement
VITE_HOST=0.0.0.0  # Écoute sur toutes les interfaces réseau
VITE_PORT=5173
VITE_API_URL=http://<IP_DU_BACKEND>:3000  # Remplacez par l'IP réelle du serveur backend
```

**Note :** `0.0.0.0` permet d'écouter sur toutes les interfaces réseau, rendant le serveur accessible depuis d'autres machines. Utilisez une IP spécifique si vous voulez limiter l'accès à une interface particulière.

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données existe

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL du frontend
- Vérifiez que le backend accepte les requêtes depuis le frontend

### Erreur d'authentification
- Vérifiez que `JWT_SECRET` est défini et suffisamment long (minimum 32 caractères)

## Support

Pour toute question, contactez le Secrétariat Technique du Prix de l'Innovation - MEF.

