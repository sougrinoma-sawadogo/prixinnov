# SSL Certificate Setup Guide for prinnov.benit.biz

This guide explains how to obtain and configure SSL certificates for your production deployment.

## Option 1: Let's Encrypt (Free, Recommended)

Let's Encrypt provides free SSL certificates that are valid for 90 days and can be automatically renewed.

### Prerequisites

1. Your domain `prinnov.benit.biz` must be pointing to your server's IP address
2. Ports 80 and 443 must be open in your firewall
3. You have SSH access to your server

### Step-by-Step Instructions

#### 1. Install Certbot

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install certbot
```

**On CentOS/RHEL:**
```bash
sudo yum install certbot
# or for newer versions
sudo dnf install certbot
```

#### 2. Stop Any Running Web Server

If you have nginx or apache running, stop them temporarily:
```bash
# If using system nginx
sudo systemctl stop nginx

# Or if using Docker
docker-compose -f docker-compose.prod.yml down
```

#### 3. Obtain the Certificate

**Standalone method (recommended for first-time setup):**
```bash
sudo certbot certonly --standalone \
  -d prinnov.benit.biz \
  -d www.prinnov.benit.biz \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

**Webroot method (if you have a web server running):**
```bash
sudo certbot certonly --webroot \
  -w /var/www/html \
  -d prinnov.benit.biz \
  -d www.prinnov.benit.biz \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

#### 4. Copy Certificates to Your Project

After successful certificate generation, copy them to your project:

```bash
# Navigate to your project directory
cd /path/to/prixddi

# Create ssl directory if it doesn't exist
mkdir -p nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/prinnov.benit.biz/privkey.pem nginx/ssl/

# Set proper permissions
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem
sudo chown $USER:$USER nginx/ssl/*.pem
```

#### 5. Set Up Automatic Renewal

Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

**Create a renewal script:**
```bash
sudo nano /etc/cron.d/certbot-renewal
```

Add this content:
```bash
# Renew Let's Encrypt certificates twice daily
0 0,12 * * * root certbot renew --quiet --deploy-hook "cd /path/to/prixddi && cp /etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem nginx/ssl/ && cp /etc/letsencrypt/live/prinnov.benit.biz/privkey.pem nginx/ssl/ && docker-compose -f docker-compose.prod.yml restart nginx"
```

**Or use systemd timer (recommended):**
```bash
# Create renewal script
sudo nano /usr/local/bin/renew-ssl.sh
```

Add:
```bash
#!/bin/bash
certbot renew --quiet
cd /path/to/prixddi
cp /etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/prinnov.benit.biz/privkey.pem nginx/ssl/
chmod 644 nginx/ssl/fullchain.pem
chmod 600 nginx/ssl/privkey.pem
docker-compose -f docker-compose.prod.yml restart nginx
```

Make it executable:
```bash
sudo chmod +x /usr/local/bin/renew-ssl.sh
```

Test renewal:
```bash
sudo certbot renew --dry-run
```

## Option 2: Using Docker with Certbot

You can also use Certbot in a Docker container:

### 1. Create a temporary docker-compose file for certbot

```bash
cat > docker-compose.certbot.yml << EOF
version: '3.8'
services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./nginx/ssl:/etc/letsencrypt
      - ./nginx/certbot-www:/var/www/certbot
    command: certonly --webroot -w /var/www/certbot -d prinnov.benit.biz -d www.prinnov.benit.biz --email your-email@example.com --agree-tos --non-interactive
EOF
```

### 2. Run certbot

```bash
# Create webroot directory
mkdir -p nginx/certbot-www

# Run certbot
docker-compose -f docker-compose.certbot.yml run --rm certbot

# Copy certificates (they'll be in nginx/ssl/live/prinnov.benit.biz/)
cp nginx/ssl/live/prinnov.benit.biz/fullchain.pem nginx/ssl/
cp nginx/ssl/live/prinnov.benit.biz/privkey.pem nginx/ssl/
```

## Option 3: Commercial SSL Certificate

If you prefer a commercial certificate (e.g., from your domain registrar or hosting provider):

1. **Purchase the certificate** from your provider
2. **Download the certificate files** (usually includes certificate chain and private key)
3. **Place them in your project:**
   ```bash
   # Certificate chain
   cp your-certificate-chain.pem nginx/ssl/fullchain.pem
   
   # Private key
   cp your-private-key.key nginx/ssl/privkey.pem
   
   # Set permissions
   chmod 644 nginx/ssl/fullchain.pem
   chmod 600 nginx/ssl/privkey.pem
   ```

## Option 4: Self-Signed Certificate (Development Only)

⚠️ **Warning:** Self-signed certificates are NOT recommended for production. They will show security warnings in browsers.

For development/testing only:

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=prinnov.benit.biz"

# Set permissions
chmod 644 nginx/ssl/fullchain.pem
chmod 600 nginx/ssl/privkey.pem
```

## Verifying Your Certificates

After obtaining certificates, verify they're correct:

```bash
# Check certificate details
openssl x509 -in nginx/ssl/fullchain.pem -text -noout

# Check certificate expiration
openssl x509 -in nginx/ssl/fullchain.pem -noout -dates

# Verify certificate matches private key
openssl x509 -noout -modulus -in nginx/ssl/fullchain.pem | openssl md5
openssl rsa -noout -modulus -in nginx/ssl/privkey.pem | openssl md5
# Both commands should output the same hash
```

## Troubleshooting

### Certificate generation fails

1. **Check DNS:** Ensure your domain points to your server
   ```bash
   dig prinnov.benit.biz
   nslookup prinnov.benit.biz
   ```

2. **Check firewall:** Ensure ports 80 and 443 are open
   ```bash
   sudo ufw status
   # or
   sudo iptables -L
   ```

3. **Check if port 80 is in use:**
   ```bash
   sudo netstat -tulpn | grep :80
   ```

### Certificate renewal fails

1. **Test renewal manually:**
   ```bash
   sudo certbot renew --dry-run
   ```

2. **Check certificate expiration:**
   ```bash
   sudo certbot certificates
   ```

3. **Check logs:**
   ```bash
   sudo tail -f /var/log/letsencrypt/letsencrypt.log
   ```

### Docker nginx can't read certificates

1. **Check file permissions:**
   ```bash
   ls -la nginx/ssl/
   ```

2. **Ensure files are readable:**
   ```bash
   chmod 644 nginx/ssl/fullchain.pem
   chmod 600 nginx/ssl/privkey.pem
   ```

3. **Check nginx logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs nginx
   ```

## Quick Reference

**Certificate locations:**
- Let's Encrypt: `/etc/letsencrypt/live/prinnov.benit.biz/`
- Project: `nginx/ssl/`

**Important files:**
- `fullchain.pem` - Certificate chain (certificate + intermediate certificates)
- `privkey.pem` - Private key

**Renewal commands:**
```bash
# Manual renewal
sudo certbot renew

# Test renewal (dry run)
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

## Security Best Practices

1. **Never commit private keys to git** - Add `nginx/ssl/*.pem` to `.gitignore`
2. **Use strong permissions** - Private key should be 600, certificate 644
3. **Set up automatic renewal** - Don't let certificates expire
4. **Monitor expiration** - Set up alerts for certificate expiration
5. **Use HSTS headers** - Already configured in nginx config
6. **Keep certbot updated** - `sudo apt-get update && sudo apt-get upgrade certbot`

## Next Steps

After obtaining SSL certificates:

1. Verify certificates are in place:
   ```bash
   ls -la nginx/ssl/
   ```

2. Deploy your application:
   ```bash
   ./deploy.sh  # or deploy.ps1 on Windows
   ```

3. Test HTTPS:
   ```bash
   curl https://prinnov.benit.biz/api/health
   ```

4. Visit in browser:
   ```
   https://prinnov.benit.biz
   ```

You should see a secure connection with a valid SSL certificate! 🔒

