# RentNest Manual Testing Guide

This guide is designed for a human QA tester to systematically verify every feature of the RentNest API from end to end using Postman. It covers both happy paths and edge cases as explicitly implemented in the codebase.

## 1. Prerequisites

### Database and Environment Setup
1. Copy `.env.example` to `.env` and configure your `DATABASE_URL` (PostgreSQL).
2. Run database migrations: `npx prisma migrate deploy`
3. Seed the database with categories, the Admin user, and a sample property:
   ```bash
   npx prisma db seed
   ```
4. Start the backend server locally (defaults to `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### Stripe Webhook Setup
Since payments require Stripe webhooks to transition states, you must run the Stripe CLI locally to forward webhooks to your server:
1. Open a separate terminal.
2. Run the following command:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
3. Copy the `whsec_...` secret printed in the terminal into your `.env` file as `STRIPE_WEBHOOK_SECRET`.
4. Restart your server if needed to load the new `.env`.

### Postman Setup
1. Import `postman_collection.json` (located at the root of the repository) into Postman.
2. Create a Postman Environment (e.g., "RentNest Local") and add the following variables:
   - `baseUrl`: `http://localhost:5000`
   - `tenantToken`: (leave blank)
   - `landlordToken`: (leave blank)
   - `adminToken`: (leave blank)
   - `propertyId`: (leave blank)
   - `rentalRequestId`: (leave blank)
3. Ensure you have the admin credentials handy. They are seeded in `prisma/seed.ts`. Check that file, but generally they are:
   - Email: `admin@rentnest.com`
   - Password: Check the seed file!

---

## 2. Step-by-Step Test Sequence

### Step 1: Registration and Admin Block
- **Action**: Register a Tenant.
- **Method & Path**: `POST /api/auth/register`
- **Role**: None
- **Body**:
  ```json
  {
    "name": "Jane Tenant",
    "email": "jane@tenant.com",
    "password": "password123",
    "role": "TENANT",
    "phone": "555-0101"
  }
  ```
- **Expected**: `201 Created` returning the user data without password.
- **Negative Case A — Admin role blocked at validation layer**: Try to register with `"role": "ADMIN"`.
  - **Body**: Same as above but `"role": "ADMIN"`, `"email": "fake@admin.com"`
  - **Expected**: `400 Bad Request`. The validation layer (`auth.validation.ts`) now rejects ADMIN directly — you will see:
    ```json
    {
      "success": false,
      "message": "Validation failed",
      "errorDetails": {
        "issues": [{ "field": "body.role", "message": "Role must be LANDLORD or TENANT" }]
      }
    }
    ```
- **Action**: Register a Landlord.
- **Body**: Same structure, but with `"email": "bob@landlord.com"`, `"role": "LANDLORD"`.
  - **Expected**: `201 Created`.


### Step 2: Duplicate Registration
- **Action**: Register again with `jane@tenant.com`.
- **Method & Path**: `POST /api/auth/register`
- **Role**: None
- **Body**: Same as Jane Tenant above.
- **Expected**: `400 Bad Request` (`User already exists`).

### Step 3: Login all Roles
- **Action**: Login Tenant
- **Method & Path**: `POST /api/auth/login`
- **Body**: `{"email": "jane@tenant.com", "password": "password123"}`
- **Post-Action**: Copy `data.accessToken` to `tenantToken` variable.
- **Expected**: `200 OK` with token.
- **Action**: Login Landlord
- **Body**: `{"email": "bob@landlord.com", "password": "password123"}`
- **Post-Action**: Copy `data.accessToken` to `landlordToken` variable.
- **Action**: Login Admin (using seed credentials)
- **Body**: `{"email": "admin@rentnest.com", "password": "password123"}`
- **Post-Action**: Copy `data.accessToken` to `adminToken` variable.
- **Negative Case**: Wrong password for Tenant.
  - **Expected**: `401 Unauthorized` (`Invalid credentials`).

### Step 4: Verify Profiles
- **Action**: Get Me (run once for each role token)
- **Method & Path**: `GET /api/auth/me`
- **Role**: TENANT, LANDLORD, ADMIN
- **Expected**: `200 OK` with the matching user profile.

### Step 5: Category CRUD
- **Action**: Create a Category
- **Method & Path**: `POST /api/categories`
- **Role**: Admin
- **Body**: `{"name": "Mansion", "description": "Large luxurious house"}`
- **Expected**: `201 Created`. Note the ID.
- **Negative Case**: Call the exact same endpoint with the `tenantToken`.
  - **Expected**: `403 Forbidden` (`Forbidden access`).

### Step 6: Property Management
- **Action**: Create Property
- **Method & Path**: `POST /api/landlord/properties`
- **Role**: Landlord
- **Body**:
  ```json
  {
    "title": "Cozy Mansion",
    "description": "Very big",
    "address": "123 Rich St",
    "city": "Beverly Hills",
    "price": 5000,
    "bedrooms": 5,
    "bathrooms": 4,
    "area": 4000,
    "amenities": ["Pool"],
    "categoryId": "<any-category-id>",
    "images": ["url.jpg"]
  }
  ```
- **Post-Action**: Copy `data.id` to `propertyId`.
- **Expected**: `201 Created`.
- **Action**: Update Property
- **Method & Path**: `PUT /api/landlord/properties/{{propertyId}}`
- **Role**: Landlord (the owner)
- **Body**: `{"price": 4500}`
- **Expected**: `200 OK`.
- **Negative Case**: Switch to a *different* Landlord token and try to update that property.
  - **Expected**: `403 Forbidden` (`You do not own this property`).
- **Action**: List Properties
- **Method & Path**: `GET /api/properties?city=Beverly Hills`
- **Role**: None / Public
- **Expected**: `200 OK`, should see the property because its status is `AVAILABLE`.

### Step 7: Rental Requests
- **Action**: Request Rental
- **Method & Path**: `POST /api/rentals`
- **Role**: Tenant
- **Body**:
  ```json
  {
    "propertyId": "{{propertyId}}",
    "moveInDate": "2026-12-01T00:00:00.000Z",
    "message": "I love this place"
  }
  ```
- **Post-Action**: Copy `data.id` to `rentalRequestId`.
- **Expected**: `201 Created`.
- **Negative Case**: Try requesting the exact same property again as the same tenant.
  - **Expected**: `400 Bad Request` (`You already have a pending or approved request for this property`).
- **Action**: Get Request by ID
- **Method & Path**: `GET /api/rentals/{{rentalRequestId}}`
- **Role**: Tenant (the one who requested)
- **Expected**: `200 OK`.
- **Negative Case**: Switch to a *different* Tenant token and call the same endpoint.
  - **Expected**: `403 Forbidden`.

### Step 8: Landlord Approval
- **Action**: View Landlord Requests
- **Method & Path**: `GET /api/landlord/requests`
- **Role**: Landlord
- **Expected**: `200 OK`, list should include the request from Step 7.
- **Negative Case**: Non-owner landlord tries to approve.
  - **Method & Path**: `PATCH /api/landlord/requests/{{rentalRequestId}}`
  - **Body**: `{"status": "APPROVED"}`
  - **Expected**: `403 Forbidden` (`You do not own this property`).
- **Action**: Approve Request
- **Method & Path**: `PATCH /api/landlord/requests/{{rentalRequestId}}`
- **Role**: Landlord (owner)
- **Body**: `{"status": "APPROVED"}`
- **Expected**: `200 OK`.
- **Action**: Check Property Status
- **Method & Path**: `GET /api/properties/{{propertyId}}`
- **Expected**: Property `status` should still be `AVAILABLE`. (It only changes to RENTED upon payment).

### Step 9: Payment & Webhook
- **Negative Case**: Try creating a payment for a PENDING or REJECTED request. (Use a different request if needed, or imagine trying before approval).
  - **Expected**: `400 Bad Request` (`Rental request is not APPROVED`).
- **Action**: Create Payment Session
- **Method & Path**: `POST /api/payments/create`
- **Role**: Tenant
- **Body**: `{"rentalRequestId": "{{rentalRequestId}}"}`
- **Expected**: `200 OK` with a `paymentUrl`.
- **Action (Browser)**: Open the `paymentUrl` in a browser and pay with Stripe test card `4242 4242 4242 4242`.
- **Verification (Database/Terminal)**: Look at the Stripe CLI terminal to confirm the webhook `checkout.session.completed` arrived. Open `npx prisma studio` and confirm:
  - `Payment` status is `COMPLETED`
  - `RentalRequest` status is `ACTIVE`
  - `Property` status is `RENTED`

### Step 10: Complete the Rental
- **Negative Case**: Try calling this endpoint *before* the Stripe webhook has fired (status is still APPROVED, not ACTIVE).
  - **Method & Path**: `PATCH /api/landlord/requests/{{rentalRequestId}}/complete`
  - **Expected**: `400 Bad Request` (`Rental request is not ACTIVE`).
- **Negative Case**: Non-owner landlord tries to complete.
  - **Expected**: `403 Forbidden` (`You do not own this property`).
- **Action**: Complete Request
- **Method & Path**: `PATCH /api/landlord/requests/{{rentalRequestId}}/complete`
- **Role**: Landlord (owner)
- **Expected**: `200 OK`, `status` is now `COMPLETED`.

### Step 11: Reviews
- **Negative Case**: Try leaving a review before the request is `COMPLETED`. (If you tried in Step 9).
  - **Expected**: `400 Bad Request` (`Rental is not COMPLETED yet`).
- **Negative Case**: Bad rating validation.
  - **Method & Path**: `POST /api/reviews`
  - **Role**: Tenant
  - **Body**: `{"rentalRequestId": "{{rentalRequestId}}", "rating": 6, "comment": "Too good"}`
  - **Expected**: `400 Bad Request` (Zod validation error for rating).
- **Action**: Create Review
- **Method & Path**: `POST /api/reviews`
- **Role**: Tenant
- **Body**: `{"rentalRequestId": "{{rentalRequestId}}", "rating": 5, "comment": "Great place!"}`
- **Expected**: `201 Created`.
- **Negative Case**: Duplicate review on same request.
  - **Method & Path**: `POST /api/reviews` (Submit same body again).
  - **Expected**: `400 Bad Request` (`You have already reviewed this rental request`).

### Step 12: Admin Actions
- **Action**: Get Users
- **Method & Path**: `GET /api/admin/users`
- **Role**: Admin
- **Expected**: `200 OK` listing all users. Find the ID of the Tenant.
- **Action**: Ban User
- **Method & Path**: `PATCH /api/admin/users/{{tenantUserId}}`
- **Role**: Admin
- **Body**: `{"status": "BANNED"}`
- **Expected**: `200 OK`.
- **Negative Case**: Banned user tries to login or use token.
  - **Action 1**: `POST /api/auth/login` as Tenant -> `403 Forbidden` (`User is banned` or `User not found` depending on logic, but expects blocked).
  - **Action 2**: `GET /api/auth/me` with `tenantToken` -> `403 Forbidden` (`User is banned`).

### Step 13: Error Response Shape Verification
Pick three endpoints that failed above (e.g., Duplicate Review, Wrong Password, Non-Admin Category Creation). Check the raw JSON response in Postman.
Ensure EVERY single one strictly matches this exact schema format:
```json
{
  "success": false,
  "message": "Specific error message here",
  "errorDetails": {
    ...
  }
}
```
If you see a raw HTML stack trace or `errorDetails` missing, the requirement fails.

---

## 3. Postman Collection Runner Instructions
1. Open the **RentNest API - Full Collection** in Postman.
2. The collection is organized by resource folders (`Auth`, `Categories`, `Properties`, etc.).
3. To run end-to-end, you can use the **Collection Runner** by dragging the requests into the exact order outlined in Section 2.
4. **Manual Intervention Required:** The Stripe Checkout step (`Step 9`) **cannot** be automated entirely in Postman. You must pause the runner after `POST /api/payments/create`, open the returned URL in your browser, enter the test card details, and wait for the webhook to update the database before resuming the runner for Step 10.

---

## 4. Final Verification Checklist
Before submitting, use this checklist to confirm the 5 core assignments requirements were met:

- [ ] **API Documentation**: Verified in Step 3 (all endpoints present in the collection).
- [ ] **Error Formats**: Verified in Step 13 (all errors match the `{ success: false, ... }` format).
- [ ] **Validation**: Verified in Step 11 (Zod actively rejecting bad review ratings).
- [ ] **Admin Credentials**: Verified in Step 3 (Logged in using seeded Admin without public registration).
- [ ] **Payment Integration**: Verified in Step 9 (Stripe Webhook properly triggered database state transitions).
