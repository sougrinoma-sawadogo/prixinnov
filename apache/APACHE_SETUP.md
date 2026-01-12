# Configuration Apache pour Prix DDI

Ce guide explique comment configurer Apache comme reverse proxy pour l'application Prix DDI sur un serveur qui a déjà Apache installé avec d'autres applications.

## Prérequis

1. Apache 2.4+ installé et configuré
2. Docker et Docker Compose installés
3. Modules Apache nécessaires activés
4. Certificat SSL pour le domaine `prinnov.benit.biz`

## Étapes de configuration

### 1. Activer les modules Apache requis

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod headers
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 2. Modifier docker-compose.prod.yml

Modifiez le fichier `docker-compose.prod.yml` pour ne pas exposer les ports 80/443 (puisque Apache les utilise déjà) :

```yaml
# Supprimez ou commentez le service nginx
# OU changez les ports pour utiliser d'autres ports (ex: 8080, 8443)

services:
  backend:
    # ... configuration existante ...
    ports:
      - "3000:3000"  # Garder le port 3000 pour le backend
  
  frontend:
    # ... configuration existante ...
    # Si vous utilisez nginx pour servir le frontend, changez les ports:
    ports:
      - "8080:80"  # Utiliser le port 8080 au lieu de 80
```

### 3. Copier la configuration Apache

```bash
# Copier le fichier de configuration
sudo cp apache/prixddi.conf /etc/apache2/sites-available/prixddi.conf

# Activer le site
sudo a2ensite prixddi.conf

# Vérifier la configuration
sudo apache2ctl configtest

# Recharger Apache
sudo systemctl reload apache2
```

### 4. Configurer les certificats SSL

#### Option A: Utiliser les certificats existants d'Apache

Si vous avez déjà des certificats SSL configurés pour d'autres sites, vous pouvez les réutiliser ou créer des certificats spécifiques pour `prinnov.benit.biz`.

#### Option B: Utiliser Let's Encrypt

```bash
# Installer certbot si ce n'est pas déjà fait
sudo apt-get install certbot python3-certbot-apache

# Obtenir le certificat (certbot configurera Apache automatiquement)
sudo certbot --apache -d prinnov.benit.biz -d www.prinnov.benit.biz

# Les certificats seront automatiquement configurés dans le fichier VirtualHost
```

### 5. Configurer le chemin du frontend

Vous avez deux options pour servir le frontend :

#### Option A: Servir depuis un répertoire local

1. Build le frontend :
```bash
cd frontend
npm run build
```

2. Copier les fichiers buildés :
```bash
sudo mkdir -p /var/www/prixddi/frontend/dist
sudo cp -r dist/* /var/www/prixddi/frontend/dist/
sudo chown -R www-data:www-data /var/www/prixddi
```

3. Dans `apache/prixddi.conf`, utilisez la section `DocumentRoot` (déjà configurée)

#### Option B: Proxy vers le conteneur nginx

1. Dans `docker-compose.prod.yml`, gardez le service nginx mais changez les ports :
```yaml
nginx:
  ports:
    - "8080:80"  # Au lieu de "80:80"
```

2. Dans `apache/prixddi.conf`, décommentez la section `<Location />` qui proxy vers `localhost:8080`

### 6. Démarrer les conteneurs Docker

```bash
# Démarrer les services (sans nginx si vous servez le frontend depuis Apache)
docker-compose -f docker-compose.prod.yml up -d postgres backend frontend

# OU si vous utilisez nginx pour le frontend
docker-compose -f docker-compose.prod.yml up -d
```

### 7. Vérifier la configuration

```bash
# Vérifier qu'Apache écoute sur les bons ports
sudo netstat -tlnp | grep apache

# Vérifier les logs Apache
sudo tail -f /var/log/apache2/prixddi_error.log
sudo tail -f /var/log/apache2/prixddi_access.log

# Vérifier que les conteneurs Docker sont en cours d'exécution
docker ps
```

## Configuration de docker-compose.prod.yml modifiée

Voici un exemple de `docker-compose.prod.yml` modifié pour fonctionner avec Apache :

```yaml
services:
  postgres:
    # ... configuration existante ...
    # Pas de changement nécessaire

  backend:
    # ... configuration existante ...
    ports:
      - "3000:3000"  # Exposer le port 3000 pour Apache
    # Supprimer depends_on nginx

  frontend:
    # Option 1: Build seulement, servir depuis Apache
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    # Pas de ports exposés, les fichiers seront copiés vers /var/www/prixddi/frontend/dist
    
    # Option 2: Utiliser nginx sur un port différent
    # build: ...
    # volumes: ...
    # ports:
    #   - "8080:80"  # Port différent pour Apache proxy
```

## Dépannage

### Le backend ne répond pas

1. Vérifiez que le conteneur backend est en cours d'exécution :
```bash
docker ps | grep backend
```

2. Testez la connexion directement :
```bash
curl http://localhost:3000/api/health
```

3. Vérifiez les logs :
```bash
docker logs prixddi_backend_prod
```

### Le frontend ne s'affiche pas

1. Vérifiez les permissions du répertoire :
```bash
sudo ls -la /var/www/prixddi/frontend/dist
sudo chown -R www-data:www-data /var/www/prixddi
```

2. Vérifiez que les fichiers sont présents :
```bash
ls -la /var/www/prixddi/frontend/dist/index.html
```

### Erreurs SSL

1. Vérifiez que les certificats existent :
```bash
sudo ls -la /etc/ssl/certs/prinnov.benit.biz.crt
sudo ls -la /etc/ssl/private/prinnov.benit.biz.key
```

2. Vérifiez les permissions :
```bash
sudo chmod 644 /etc/ssl/certs/prinnov.benit.biz.crt
sudo chmod 600 /etc/ssl/private/prinnov.benit.biz.key
```

## Gestion de plusieurs applications sur Apache

Si vous avez plusieurs applications sur le même serveur Apache, chaque application doit avoir son propre VirtualHost avec un ServerName différent. Apache utilisera le ServerName pour déterminer quel VirtualHost utiliser pour chaque requête.

Exemple de configuration pour plusieurs applications :

```apache
# Application 1
<VirtualHost *:443>
    ServerName app1.example.com
    # ... configuration ...
</VirtualHost>

# Application 2 (Prix DDI)
<VirtualHost *:443>
    ServerName prinnov.benit.biz
    # ... configuration ...
</VirtualHost>

# Application 3
<VirtualHost *:443>
    ServerName app3.example.com
    # ... configuration ...
</VirtualHost>
```

## Renouvellement automatique des certificats SSL

Si vous utilisez Let's Encrypt, configurez le renouvellement automatique :

```bash
# Vérifier que le renouvellement automatique est configuré
sudo systemctl status certbot.timer

# Tester le renouvellement
sudo certbot renew --dry-run
```

## Notes importantes

1. **Ports** : Assurez-vous que les ports 80 et 443 ne sont utilisés que par Apache, pas par les conteneurs Docker
2. **Firewall** : Ouvrez les ports 80 et 443 dans votre firewall si nécessaire
3. **SELinux** : Si SELinux est activé, vous devrez peut-être configurer les permissions pour permettre à Apache de se connecter aux conteneurs Docker
4. **Logs** : Surveillez les logs Apache et Docker pour détecter les problèmes

