# Plateforme Numérique du Prix de l'Innovation - MEF

## 📋 Table des matières

1. [Présentation du Projet](#présentation-du-projet)
2. [Catégories de Prix](#catégories-de-prix)
3. [Architecture de la Base de Données](#architecture-de-la-base-de-données)
4. [Workflows par Catégorie](#workflows-par-catégorie)
5. [Fonctionnalités Clés](#fonctionnalités-clés)
6. [Interface d'Administration](#interface-dadministration)
7. [Technologies Recommandées](#technologies-recommandées)

---

## 🎯 Présentation du Projet

Ce projet consiste en une **application web** destinée à dématérialiser le processus de candidature pour le **Prix de l'Innovation du Ministère de l'Économie et des Finances (MEF) du Burkina Faso**.

La plateforme permet aux différentes structures du ministère de soumettre leurs projets innovants de manière structurée selon quatre catégories distinctes, remplaçant ainsi les formulaires papier par un système numérique centralisé et sécurisé.

### Objectifs

- Centraliser toutes les candidatures dans un système unique
- Adapter dynamiquement les formulaires selon la catégorie de prix
- Faciliter l'évaluation par le Comité de Coordination
- Assurer la traçabilité et l'historique des candidatures
- Permettre la gestion documentaire (logos, pièces jointes)

---

## 🏆 Catégories de Prix

L'application gère quatre catégories de prix distinctes :

### 1. Prix « Créativité »
Pour les innovations au **stade d'idée**. Cette catégorie se concentre sur :
- L'idée de l'innovation
- Les objectifs visés
- **Ne nécessite pas** de résultats déjà atteints

### 2. Prix « Émergence »
Pour les **produits, services ou projets en cours de mise en œuvre**. Cette catégorie exige :
- La date de mise en œuvre
- Un tableau comparatif entre objectifs visés et résultats déjà atteints

### 3. Prix « Excellence »
Pour les **innovations confirmées ayant atteint des résultats probants**. Similaire à l'Émergence, cette catégorie nécessite :
- La date de mise en œuvre
- Un tableau détaillé des résultats atteints par rapport aux objectifs

### 4. Prix « Spéciaux »
Concernant deux sous-catégories :
- **Souveraineté et Résilience Économique**
- **Engagement citoyen au MEF**

Le candidat doit décrire une action novatrice ou des réalisations exceptionnelles.

---

## 🗄️ Architecture de la Base de Données

L'architecture est conçue pour refléter fidèlement les fiches de candidature officielles du MEF.

### A. Table `Structures`

Stocke les informations d'identification de l'entité candidate (communes à toutes les candidatures).

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `denomination` | VARCHAR | Nom complet de la structure |
| `sigle` | VARCHAR | Sigle officiel |
| `adresse_postale` | TEXT | Adresse postale |
| `email` | VARCHAR | Adresse e-mail de contact |
| `identite_responsable` | VARCHAR | Identité du premier responsable |
| `contact_responsable` | VARCHAR | Contact du premier responsable |
| `site_web` | VARCHAR | URL du site web (optionnel) |
| `logo_path` | VARCHAR | Chemin vers le fichier logo téléchargé |
| `type_structure` | ENUM | Type de structure :<br>- Structure de mission<br>- Direction générale<br>- Structure rattachée<br>- Projet/Programme de développement<br>- Autre |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

### B. Table `Candidatures`

Table centrale contenant les détails de l'innovation.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `structure_id` | INT (FK) | Clé étrangère vers `Structures` |
| `categorie_prix` | ENUM | Créativité, Émergence, Excellence, Spéciaux |
| `sous_categorie_special` | VARCHAR | Requis uniquement pour Prix Spéciaux :<br>- Souveraineté et Résilience Économique<br>- Engagement citoyen au MEF |
| `presentation_breve` | TEXT | Texte descriptif de l'innovation |
| `date_projet` | DATE | Date de création du projet |
| `date_mise_en_oeuvre` | DATE | Uniquement pour Émergence et Excellence (nullable) |
| `diagnostic` | TEXT | Problème résolu ou à résoudre |
| `cible` | TEXT | Acteurs impactés |
| `particularite` | TEXT | Ce qui rend le projet innovant |
| `adequation_secteur` | TEXT | Alignement avec la planification du secteur |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

**Relations :**
- `structure_id` → `Structures.id` (Many-to-One)

### C. Table `Objectifs_Resultats`

Gère les tableaux dynamiques des objectifs visés et des résultats atteints.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `candidature_id` | INT (FK) | Clé étrangère vers `Candidatures` |
| `libelle_objectif` | TEXT | Description de l'objectif |
| `resultat_atteint` | TEXT | Résultat atteint (nullable pour Créativité, obligatoire pour Émergence/Excellence) |
| `ordre` | INT | Ordre d'affichage dans le tableau |
| `created_at` | TIMESTAMP | Date de création |

**Relations :**
- `candidature_id` → `Candidatures.id` (Many-to-One)

### D. Table `Perspectives_Suivi`

Stocke les projections à moyen terme (pour Créativité, Émergence et Excellence uniquement).

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `candidature_id` | INT (FK) | Clé étrangère vers `Candidatures` |
| `objectifs_3_ans` | TEXT | Objectifs visés pour les 3 prochaines années |
| `besoins_3_ans` | TEXT | Moyens nécessaires (humains, financiers, techniques) pour atteindre ces objectifs |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

**Relations :**
- `candidature_id` → `Candidatures.id` (One-to-One)

### E. Table `Evaluations`

Réservée au Secrétariat Technique et au Comité de Coordination.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `candidature_id` | INT (FK) | Clé étrangère vers `Candidatures` |
| `statut` | ENUM | Statut de la candidature :<br>- `soumis` : Candidature soumise (statut initial)<br>- `examen` : Candidature en cours d'examen<br>- `admis` : Candidature admise |
| `decision_finale` | TEXT | Texte de la décision du Comité de Coordination du Prix de l'Innovation |
| `evaluateur_id` | INT (FK) | Clé étrangère vers `Utilisateurs` (identifiant de l'évaluateur) |
| `date_evaluation` | TIMESTAMP | Date de l'évaluation |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

**Relations :**
- `candidature_id` → `Candidatures.id` (One-to-One)
- `evaluateur_id` → `Utilisateurs.id` (Many-to-One)

**Note :** Le statut est initialisé à `soumis` lors de la création de la candidature. Il peut être modifié par le Secrétariat Technique ou le Comité de Coordination.

### F. Table `Pieces_Jointes`

Permet de lier un nombre illimité de documents de preuve à un dossier.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `candidature_id` | INT (FK) | Clé étrangère vers `Candidatures` |
| `fichier_path` | VARCHAR | Chemin de stockage du document sur le serveur |
| `libelle` | VARCHAR | Type de document (valeur par défaut : "Contrat")<br>Exemples : Contrat, Attestation, Preuve technique, Rapport d'impact |
| `taille_fichier` | INT | Taille du fichier en octets |
| `type_mime` | VARCHAR | Type MIME du fichier (ex: application/pdf, image/png) |
| `created_at` | TIMESTAMP | Date de création |

**Relations :**
- `candidature_id` → `Candidatures.id` (Many-to-One)

### G. Table `Roles`

Définit les différents rôles d'administration dans le système.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `nom` | VARCHAR | Nom du rôle :<br>- `secretaire_technique` : Secrétariat Technique<br>- `comite_coordination` : Comité de Coordination<br>- `super_admin` : Super Administrateur |
| `description` | TEXT | Description des permissions du rôle |
| `permissions` | JSON | Liste des permissions spécifiques (optionnel, pour système de permissions avancé) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

**Rôles par défaut :**
- **Secrétariat Technique** : Peut consulter toutes les candidatures, modifier les statuts, préparer les dossiers
- **Comité de Coordination** : Peut consulter toutes les candidatures, modifier les statuts, saisir la décision finale
- **Super Administrateur** : Accès complet au système, gestion des utilisateurs

### H. Table `Utilisateurs`

Stocke les comptes des administrateurs ayant accès à l'interface d'évaluation.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT (PK) | Clé primaire |
| `nom` | VARCHAR | Nom de l'utilisateur |
| `prenom` | VARCHAR | Prénom de l'utilisateur |
| `email` | VARCHAR | Adresse e-mail (unique, utilisé pour la connexion) |
| `mot_de_passe` | VARCHAR | Mot de passe hashé (bcrypt, argon2, etc.) |
| `role_id` | INT (FK) | Clé étrangère vers `Roles` |
| `telephone` | VARCHAR | Numéro de téléphone (optionnel) |
| `actif` | BOOLEAN | Statut actif/inactif du compte (défaut : true) |
| `derniere_connexion` | TIMESTAMP | Date et heure de la dernière connexion |
| `created_at` | TIMESTAMP | Date de création du compte |
| `updated_at` | TIMESTAMP | Date de mise à jour |

**Relations :**
- `role_id` → `Roles.id` (Many-to-One)

**Sécurité :**
- Les mots de passe doivent être hashés avec un algorithme sécurisé (bcrypt, argon2)
- Implémentation d'un système de réinitialisation de mot de passe
- Possibilité d'ajouter un champ `token_reset_password` et `expiration_token` pour la réinitialisation

### Schéma Relationnel

```
Structures (1) ──< (N) Candidatures (1) ──< (N) Objectifs_Resultats
                                    │
                                    ├── (1) Perspectives_Suivi
                                    │
                                    ├── (1) Evaluations ──> (N) Utilisateurs
                                    │
                                    └── (N) Pieces_Jointes

Roles (1) ──< (N) Utilisateurs
```

**Relations détaillées :**
- `Structures` → `Candidatures` : Une structure peut avoir plusieurs candidatures
- `Candidatures` → `Objectifs_Resultats` : Une candidature peut avoir plusieurs objectifs
- `Candidatures` → `Perspectives_Suivi` : Une candidature a une seule fiche de perspectives (One-to-One)
- `Candidatures` → `Evaluations` : Une candidature a une seule évaluation (One-to-One)
- `Candidatures` → `Pieces_Jointes` : Une candidature peut avoir plusieurs pièces jointes
- `Utilisateurs` → `Evaluations` : Un utilisateur peut évaluer plusieurs candidatures
- `Roles` → `Utilisateurs` : Un rôle peut être attribué à plusieurs utilisateurs

---

## 🔄 Workflows par Catégorie

L'application propose un parcours utilisateur dynamique qui s'adapte selon la catégorie de prix sélectionnée.

### Étape Commune

1. **Saisie des informations de la structure** (Module de Profilage)
   - Dénomination, sigle, adresse postale, e-mail
   - Identité et contact du premier responsable
   - Site web (optionnel) et téléchargement du logo
   - Sélection du type de structure (liste déroulante)

2. **Choix de la catégorie de prix**

### Branchement Logique selon la Catégorie

#### Flux « Créativité »

- Formulaire axé sur **l'idée de l'innovation**
- Champs affichés :
  - Présentation brève
  - Date du projet
  - Diagnostic du problème
  - Cible impactée
  - Particularité de l'innovation
  - Adéquation avec les objectifs du secteur
  - Tableau des objectifs visés (sans colonne "Résultats atteints")
- **Ne s'affiche pas** :
  - Champ "Date de mise en œuvre"
  - Colonne "Résultats atteints" dans le tableau des objectifs

#### Flux « Émergence / Excellence »

- Formulaire axé sur le **produit/service en cours**
- Champs affichés :
  - Tous les champs de base
  - **Date de mise en œuvre** (obligatoire)
  - Tableau comparatif **obligatoire** entre objectifs visés et résultats déjà atteints
- Le système exige la saisie des résultats pour chaque objectif

#### Flux « Prix Spéciaux »

- L'utilisateur doit d'abord choisir la sous-catégorie :
  - « Souveraineté et Résilience Économique »
  - « Engagement citoyen au MEF »
- Ensuite, description de l'action novatrice ou des réalisations exceptionnelles

### Perspectives à 3 ans

Pour les catégories **Créativité, Émergence et Excellence** uniquement :
- Section dédiée pour saisir :
  - Objectifs futurs pour les 3 prochaines années
  - Besoins spécifiques (humains, financiers, techniques)

---

## ⚙️ Fonctionnalités Clés

### 1. Formulaires Dynamiques

- **Adaptation automatique** des champs selon la catégorie de prix
- Affichage conditionnel :
  - Colonne "Résultats atteints" uniquement pour Émergence et Excellence
  - Champ "Date de mise en œuvre" uniquement pour Émergence et Excellence
  - Sélection de sous-catégorie uniquement pour Prix Spéciaux

### 2. Gestion Documentaire

- **Téléchargement du logo** de la structure
- **Gestion illimitée des pièces jointes** :
  - Upload multiple avec Drag & Drop
  - Libellé personnalisable (par défaut : "Contrat")
  - Formats autorisés : PDF, JPG, PNG
  - Limite de taille par fichier : 5 Mo (recommandé)

### 3. Tableaux Dynamiques

- Ajout/suppression dynamique de lignes pour les objectifs
- Validation selon la catégorie (résultats obligatoires ou non)

### 4. Historique des Candidatures

- Possibilité pour une structure de consulter ses anciennes candidatures
- Suivi de l'évolution des projets d'innovation au fil des ans

### 5. Gestion des Statuts

- Suivi du statut de chaque candidature :
  - **Soumis** : Candidature déposée (statut initial)
  - **Examen** : Candidature en cours d'évaluation
  - **Admis** : Candidature acceptée par le Comité
- Modification du statut par les administrateurs
- Filtrage et recherche par statut

### 6. Gestion des Utilisateurs Administrateurs

- **Création et gestion des comptes** :
  - Création de comptes pour le Secrétariat Technique et le Comité de Coordination
  - Attribution de rôles avec permissions spécifiques
  - Activation/désactivation des comptes
- **Authentification sécurisée** :
  - Connexion par e-mail et mot de passe
  - Réinitialisation de mot de passe
  - Gestion des sessions utilisateur
- **Traçabilité des actions** :
  - Enregistrement de l'évaluateur pour chaque modification de statut ou décision
  - Suivi de la dernière connexion

### 7. Génération de PDF

- Téléchargement d'un récapitulatif de candidature conforme aux formulaires papier d'origine

---

## 👥 Interface d'Administration

L'interface destinée au **Secrétariat Technique** et au **Comité de Coordination** doit comporter :

### Tableau de bord de suivi

- Vue d'ensemble de toutes les candidatures
- Filtres par :
  - Catégorie de prix
  - Type de structure
  - Date de soumission
  - Statut de candidature (`soumis`, `examen`, `admis`)
- Statistiques globales par statut

### Vue détaillée du dossier

- Affichage complet de tous les champs textuels :
  - Diagnostic
  - Particularité
  - Adéquation avec les objectifs du secteur
- Visualisation du logo de la structure
- Liste cliquable de toutes les pièces jointes
- Tableau des objectifs et résultats

### Module de décision

- **Gestion du statut de la candidature** :
  - Sélection du statut parmi : `soumis`, `examen`, `admis`
  - Le statut peut être modifié à tout moment par les administrateurs
  - Historique des changements de statut (optionnel)
- Champ de texte riche (WYSIWYG) intitulé **"DÉCISION DU COMITÉ DE COORDINATION DU PRIX INNOVATION"**
- Saisie directe du verdict final sur la fiche numérique
- Possibilité d'ajouter un système de notation chiffrée (optionnel)

### Gestion des utilisateurs (Super Administrateur uniquement)

- **Création de comptes** :
  - Formulaire de création avec attribution de rôle
  - Envoi d'e-mail avec identifiants temporaires (optionnel)
- **Liste des utilisateurs** :
  - Vue d'ensemble de tous les comptes administrateurs
  - Filtres par rôle et statut (actif/inactif)
  - Informations : nom, prénom, e-mail, rôle, dernière connexion
- **Modification des comptes** :
  - Changement de rôle
  - Activation/désactivation de compte
  - Réinitialisation de mot de passe
- **Suppression de comptes** :
  - Désactivation plutôt que suppression (conservation de l'historique)

### Authentification sécurisée

- **Système de connexion** :
  - Authentification par e-mail et mot de passe
  - Mots de passe hashés avec algorithme sécurisé (bcrypt, argon2)
  - Gestion des sessions (JWT tokens)
  - Réinitialisation de mot de passe sécurisée
- **Gestion des rôles et permissions** :
  - **Secrétariat Technique** : Consultation, modification des statuts, préparation des dossiers
  - **Comité de Coordination** : Consultation, modification des statuts, saisie de la décision finale
  - **Super Administrateur** : Accès complet, gestion des utilisateurs
- **Traçabilité** :
  - Enregistrement de l'évaluateur pour chaque évaluation
  - Historique des actions (optionnel : table de logs)
- **Gestion des comptes** :
  - Activation/désactivation des comptes utilisateurs
  - Suivi de la dernière connexion

---

## 💻 Technologies Recommandées

### Frontend

- **React** ou **Vue.js** pour l'interface utilisateur
- Composants d'upload : **Dropzone.js** ou **Uppy**
- Bibliothèque de formulaires dynamiques
- Framework CSS (Bootstrap, Tailwind CSS)

### Backend

- **Node.js** (Express) ou **Python** (Django/FastAPI)
- API RESTful pour la communication frontend/backend
- Système d'authentification sécurisé (JWT, OAuth2)

### Base de données

- **PostgreSQL** ou **MySQL** (base de données relationnelle)
- ORM : Sequelize (Node.js) ou SQLAlchemy (Python)

### Stockage de fichiers

- **AWS S3** ou stockage local sécurisé
- Gestion des permissions d'accès aux fichiers

### Sécurité

- Validation des formulaires (côté client et serveur)
- Limitation de la taille des fichiers
- Formats de fichiers autorisés
- Protection contre les injections SQL
- HTTPS obligatoire

### Déploiement

- **Docker** et **docker-compose.yml** pour un déploiement rapide
- Scripts de migration de base de données
- Configuration d'environnement (variables d'environnement)

---

## 📝 Notes de Développement

### Validations à implémenter

- Validation des e-mails
- Validation des dates
- Vérification des champs obligatoires selon la catégorie
- Contrôle de la taille et du format des fichiers uploadés

### Bonnes pratiques

- Code modulaire et réutilisable
- Documentation du code
- Tests unitaires et d'intégration
- Gestion des erreurs et messages utilisateur
- Logging des actions importantes

---

## 📄 Licence

Ce projet est développé pour le Ministère de l'Économie et des Finances (MEF) du Burkina Faso.

---

## 👤 Contact

Pour toute question ou contribution, veuillez contacter le Secrétariat Technique du Prix de l'Innovation - MEF.

---

**Version :** 1.0  
**Dernière mise à jour :** 2024

