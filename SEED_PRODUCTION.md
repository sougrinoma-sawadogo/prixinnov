# Running Database Seeders in Production

This guide explains how to seed the production database with initial data (roles, admin users, etc.).

## Quick Start

```bash
# Make script executable
chmod +x seed-prod.sh

# Run seeders
./seed-prod.sh
```

## Manual Method

If you prefer to run commands manually:

```bash
# 1. Ensure backend container is running
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps backend

# 2. Run all seeders
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npm run db:seed

# 3. Or run a specific seeder
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed --seed 20240101000000-roles.js
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed --seed 20240101000001-utilisateurs-admin.js
```

## What Gets Seeded

### 1. Roles Seeder (`20240101000000-roles.js`)
Creates the following roles:
- `super_admin` - Super Administrator
- `admin` - Administrator
- `evaluateur` - Evaluator
- `candidat` - Candidate

### 2. Admin Users Seeder (`20240101000001-utilisateurs-admin.js`)
Creates the following admin users:
- **Email:** `admin@mef.gov.bf`
  - **Password:** `Admin123!`
  - **Role:** Super Admin
  
- **Email:** `secretaire.technique@mef.gov.bf`
  - **Password:** `Admin123!`
  - **Role:** Super Admin

⚠️ **IMPORTANT:** Change these default passwords immediately after first login!

## Undoing Seeders

If you need to undo seeders:

```bash
# Undo all seeders
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npm run db:seed:undo

# Undo a specific seeder
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed:undo --seed 20240101000001-utilisateurs-admin.js
```

## Troubleshooting

### Error: "Le rôle super_admin n'existe pas"

This means the roles seeder hasn't been run yet. Run seeders in order:

```bash
# First run roles seeder
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed --seed 20240101000000-roles.js

# Then run users seeder
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed --seed 20240101000001-utilisateurs-admin.js
```

### Error: "Container is not running"

Start the backend container first:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d backend
```

### Error: Database connection failed

Check your `.env.prod` file has correct database credentials:

```bash
# Check environment variables
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend printenv | grep DB_
```

### Check seeder status

```bash
# Check which seeders have been run
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed:status
```

## Verifying Seeders

After running seeders, verify the data:

```bash
# Connect to database
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec postgres psql -U postgres -d prixddi_db

# Then run SQL queries:
# SELECT * FROM roles;
# SELECT id, nom, prenom, email, role_id FROM utilisateurs;
```

Or test via API:

```bash
# Test login with admin credentials
curl -X POST https://prinnov.benit.biz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mef.gov.bf","password":"Admin123!"}'
```

## Best Practices

1. **Run seeders after migrations:** Always run migrations first, then seeders
2. **Backup before seeding:** If you're re-seeding, backup your database first
3. **Change default passwords:** Immediately change default admin passwords
4. **Don't re-seed in production:** Seeders are typically run once during initial setup

## Order of Operations

For a fresh production deployment:

```bash
# 1. Start services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 2. Wait for database to be ready
sleep 10

# 3. Run migrations (happens automatically on backend start, but you can run manually)
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npm run db:migrate

# 4. Run seeders
./seed-prod.sh

# 5. Verify
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npx sequelize-cli db:seed:status
```

