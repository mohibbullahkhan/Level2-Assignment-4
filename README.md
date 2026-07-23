# RentNest API

RentNest is a rental property marketplace API built with Node.js, Express, TypeScript, and Prisma.

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set up the required environment variables (e.g., `DATABASE_URL`, `JWT_ACCESS_SECRET`, `STRIPE_SECRET_KEY`).
4. Run Prisma migrations to set up the database:
   ```bash
   npx prisma migrate dev
   ```
5. Seed the database with initial data (Admin user, categories, etc.):
   ```bash
   npm run seed
   ```
   *(Wait, if npm run seed doesn't work, run `npx prisma db seed` instead)*

6. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Credentials
- Email: `admin@rentnest.com`
- Password: `password123`

## Features
- Modular architecture
- Multi-file Prisma schema setup
- User authentication and role-based access control (Admin, Landlord, Tenant)
- CRUD operations for properties, categories, rental requests
- Payment processing via Stripe Webhooks

## Endpoints

A Postman collection `postman_collection.json` is included in the root directory covering all API endpoints. Import it into Postman and set the `baseUrl` variable to `http://localhost:5000` (or your preferred server url).
