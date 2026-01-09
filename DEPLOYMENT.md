# Deployment Guide for Prix DDI

This guide explains how to deploy the Prix DDI application to a production server using Docker.

## Prerequisites

1. **Server Requirements:**
   - Ubuntu 20.04+ or similar Linux distribution
   - Docker and Docker Compose installed
   - Domain name configured: `prinnov.benit.biz`
   - Ports 80 and 443 open in firewall

2. **Software Installation:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

## Deployment Steps

### 1. Clone and Prepare the Repository

```bash
# Clone the repository
git clone <your-repo-url> prixddi
cd prixddi

# Create production environment file
cp .env.prod.example .env.prod
nano .env.prod  # Edit with your actual values
```

### 2. Configure Environment Variables

Edit `.env.prod` and set the following required variables:

- `DB_PASSWORD`: Strong password for PostgreSQL database
- `JWT_SECRET`: Strong random string for JWT token signing
- `EMAIL_HOST`: SMTP server hostname
- `EMAIL_PORT`: SMTP port (usually 587)
- `EMAIL_USER`: Email account username
- `EMAIL_PASSWORD`: Email account password or app password
- `EMAIL_FROM`: Sender email address

### 3. Obtain SSL Certificates

#### Option A: Using Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Stop nginx temporarily (if running)
docker-compose -f docker-compose.prod.yml down

# Obtain certificates
sudo certbot certonly --standalone -d prinnov.benit.biz -d www.prinnov.benit.biz

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/prinnov.benit.biz/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem
```

#### Option B: Using Existing Certificates

Place your SSL certificates in:
- `nginx/ssl/fullchain.pem` - Certificate chain
- `nginx/ssl/privkey.pem` - Private key

### 4. Deploy the Application

#### On Linux/Mac:

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

#### On Windows:

```powershell
# Run PowerShell deployment script
.\deploy.ps1
```

#### Manual Deployment:

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Verify Deployment

1. Check that all containers are running:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. Test the API health endpoint:
   ```bash
   curl https://prinnov.benit.biz/api/health
   ```

3. Visit the application in your browser:
   ```
   https://prinnov.benit.biz
   ```

## Post-Deployment

### Database Migrations

Migrations run automatically on container start. To run manually:

```bash
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
```

### Database Seeding

To seed initial data (admin user, roles):

```bash
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate
```

### Stopping Services

```bash
docker-compose -f docker-compose.prod.yml down
```

### Backup Database

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres prixddi_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres prixddi_db < backup_file.sql
```

## SSL Certificate Renewal

If using Let's Encrypt, certificates expire every 90 days. Set up automatic renewal:

```bash
# Add to crontab
sudo crontab -e

# Add this line (runs renewal check twice daily)
0 0,12 * * * certbot renew --quiet --deploy-hook "docker-compose -f /path/to/prixddi/docker-compose.prod.yml restart nginx"
```

## Troubleshooting

### Containers won't start

1. Check logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

2. Verify environment variables:
   ```bash
   cat .env.prod
   ```

3. Check Docker resources:
   ```bash
   docker system df
   docker system prune  # Clean up if needed
   ```

### Database connection issues

1. Verify database is running:
   ```bash
   docker-compose -f docker-compose.prod.yml ps postgres
   ```

2. Check database logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

3. Test connection:
   ```bash
   docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d prixddi_db
   ```

### SSL certificate issues

1. Verify certificates exist:
   ```bash
   ls -la nginx/ssl/
   ```

2. Check certificate validity:
   ```bash
   openssl x509 -in nginx/ssl/fullchain.pem -text -noout
   ```

3. Check nginx logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs nginx
   ```

### Frontend not loading

1. Check if frontend build completed:
   ```bash
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

2. Verify nginx is serving files:
   ```bash
   docker-compose -f docker-compose.prod.yml exec nginx ls -la /usr/share/nginx/html
   ```

## Security Considerations

1. **Change default passwords** in `.env.prod`
2. **Use strong JWT_SECRET** (generate with: `openssl rand -base64 32`)
3. **Keep SSL certificates updated**
4. **Regularly update Docker images**: `docker-compose -f docker-compose.prod.yml pull`
5. **Monitor logs** for suspicious activity
6. **Set up firewall rules** to restrict access
7. **Regular backups** of database and uploads directory

## Support

For issues or questions, check the logs first:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

