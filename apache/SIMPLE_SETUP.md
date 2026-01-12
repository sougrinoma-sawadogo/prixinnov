# Configuration Simple : Apache → Nginx Container

Cette approche est la plus simple : on change les ports du conteneur nginx et on configure Apache comme reverse proxy.

## Avantages

- ✅ Pas besoin de modifier la configuration nginx existante
- ✅ Pas besoin de copier les fichiers frontend
- ✅ Le conteneur nginx continue de gérer le routage frontend/backend
- ✅ Configuration Apache minimale
- ✅ Facile à revenir en arrière

## Étapes

### 1. Modifier docker-compose.prod.yml

Changez les ports du service nginx :

```yaml
nginx:
  ports:
    - "127.0.0.1:8080:80"   # HTTP sur localhost:8080
    - "127.0.0.1:8443:443"   # HTTPS sur localhost:8443
```

### 2. Redémarrer les conteneurs

```bash
# Arrêter nginx
docker stop prixddi_nginx_prod

# Modifier docker-compose.prod.yml (changer les ports)

# Redémarrer nginx avec les nouveaux ports
docker-compose -f docker-compose.prod.yml up -d nginx
```

### 3. Vérifier que nginx écoute sur les nouveaux ports

```bash
# Vérifier les ports
sudo netstat -tulpn | grep -E ':(8080|8443)'

# Tester nginx directement
curl http://localhost:8080
```

### 4. Activer les modules Apache

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod headers
sudo systemctl restart apache2
```

### 5. Copier et activer la configuration Apache

```bash
# Copier la configuration
sudo cp apache/prixddi.conf /etc/apache2/sites-available/prixddi.conf

# Activer le site
sudo a2ensite prixddi.conf

# Tester la configuration
sudo apache2ctl configtest

# Recharger Apache
sudo systemctl reload apache2
```

### 6. Vérifier que tout fonctionne

```bash
# Vérifier qu'Apache écoute sur 80/443
sudo netstat -tulpn | grep apache

# Vérifier les logs
sudo tail -f /var/log/apache2/prixddi_error.log

# Tester l'application
curl -I https://prinnov.benit.biz
```

## Configuration finale

- **Apache** : Ports 80 (HTTP) et 443 (HTTPS) - Gère SSL et reverse proxy
- **Nginx Container** : Ports 8080 (HTTP) et 8443 (HTTPS) sur localhost uniquement
- **Backend** : Port 3000 dans le réseau Docker (accessible par nginx)
- **Frontend** : Servi par nginx container

## Dépannage

### Nginx container ne répond pas

```bash
# Vérifier que le conteneur est en cours d'exécution
docker ps | grep nginx

# Vérifier les logs
docker logs prixddi_nginx_prod

# Tester la connexion
curl http://localhost:8080
```

### Apache ne peut pas se connecter à nginx

1. Vérifier que nginx écoute sur localhost :
```bash
netstat -tuln | grep 8080
# Doit afficher: 127.0.0.1:8080
```

2. Vérifier les permissions SELinux (si activé) :
```bash
# Sur CentOS/RHEL
sudo setsebool -P httpd_can_network_connect 1
```

### Erreurs SSL

Vérifiez que les certificats sont correctement configurés dans Apache. Le conteneur nginx n'a plus besoin de certificats SSL puisqu'il reçoit les requêtes en HTTP depuis Apache.

## Rollback

Pour revenir à nginx directement :

1. Modifier `docker-compose.prod.yml` pour remettre les ports 80/443
2. Désactiver le site Apache :
```bash
sudo a2dissite prixddi.conf
sudo systemctl reload apache2
```
3. Redémarrer nginx :
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

