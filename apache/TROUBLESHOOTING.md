# Dépannage Docker Compose

## Erreur: KeyError: 'ContainerConfig'

Cette erreur peut survenir pour plusieurs raisons :

### Solution 1: Arrêter et supprimer les conteneurs existants

```bash
# Arrêter tous les conteneurs
docker-compose -f docker-compose.prod.yml down

# Supprimer les conteneurs (sans supprimer les volumes)
docker-compose -f docker-compose.prod.yml rm -f

# Redémarrer
docker-compose -f docker-compose.prod.yml up -d
```

### Solution 2: Vérifier les volumes Docker

```bash
# Lister les volumes
docker volume ls

# Inspecter le volume postgres
docker volume inspect prixddi_postgres_data

# Si nécessaire, supprimer et recréer (ATTENTION: perte de données)
docker volume rm prixddi_postgres_data
```

### Solution 3: Vérifier la version de Docker Compose

```bash
# Vérifier la version
docker-compose --version

# Si version < 2.0, mettre à jour
# Ou utiliser: docker compose (sans tiret) pour la nouvelle version
```

### Solution 4: Nettoyer complètement

```bash
# Arrêter tous les conteneurs
docker stop $(docker ps -aq)

# Supprimer tous les conteneurs
docker rm $(docker ps -aq)

# Supprimer les volumes (ATTENTION: perte de données)
docker volume prune

# Redémarrer
docker-compose -f docker-compose.prod.yml up -d
```

## Variables d'environnement manquantes

### Créer le fichier .env.prod

```bash
# Créer le fichier .env.prod à la racine du projet
cat > .env.prod << EOF
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_securise
DB_NAME=prixddi_db
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=votre_email@example.com
EMAIL_PASSWORD=votre_mot_de_passe_email
EMAIL_FROM=noreply@prinnov.benit.biz
EOF

# Protéger le fichier
chmod 600 .env.prod
```

### Vérifier que le fichier est lu

```bash
# Vérifier que docker-compose lit le fichier
docker-compose -f docker-compose.prod.yml config
```

## Redémarrer uniquement nginx

Si vous voulez juste redémarrer nginx sans toucher aux autres services :

```bash
# Option 1: Redémarrer uniquement nginx
docker restart prixddi_nginx_prod

# Option 2: Recréer uniquement nginx
docker-compose -f docker-compose.prod.yml up -d --no-deps nginx

# Option 3: Arrêter et redémarrer
docker stop prixddi_nginx_prod
docker-compose -f docker-compose.prod.yml up -d nginx
```

## Vérifier l'état des conteneurs

```bash
# Voir tous les conteneurs
docker ps -a

# Voir les logs d'un conteneur
docker logs prixddi_nginx_prod
docker logs prixddi_backend_prod
docker logs prixddi_postgres_prod

# Voir les logs en temps réel
docker logs -f prixddi_nginx_prod
```

