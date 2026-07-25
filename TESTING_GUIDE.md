# RentNest API — সম্পূর্ণ Input → Output গাইড

> **কীভাবে পড়বেন:** প্রতিটা ধাপে **Request** (কী পাঠাবেন) এবং **Response** (কী আসবে) আলাদা করে দেওয়া আছে।  
> Postman-এ `baseUrl = http://localhost:5000` সেট করুন।  
> যেখানে `{{tenantToken}}` লেখা সেখানে Authorization হেডারে `Bearer <token>` পাঠান।

---

## ধাপ ১ — Tenant রেজিস্ট্রেশন

### ✅ সফল Tenant রেজিস্ট্রেশন
```
Method : POST
URL    : {{baseUrl}}/api/auth/register
Headers: Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Rahim Mia",
  "email": "rahim@tenant.com",
  "password": "password123",
  "role": "TENANT",
  "phone": "01711000001"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "abc-123-...",
      "name": "Rahim Mia",
      "email": "rahim@tenant.com",
      "role": "TENANT",
      "status": "ACTIVE",
      "phone": "01711000001",
      "profileImage": null,
      "createdAt": "2026-07-25T07:00:00.000Z",
      "updatedAt": "2026-07-25T07:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
📌 **করণীয়:** `data.accessToken` কপি করে Postman Environment-এ `tenantToken` ভেরিয়েবলে পেস্ট করুন।

---

### ✅ সফল Landlord রেজিস্ট্রেশন
```
Method : POST
URL    : {{baseUrl}}/api/auth/register
```
**Request Body:**
```json
{
  "name": "Karim Bhai",
  "email": "karim@landlord.com",
  "password": "password123",
  "role": "LANDLORD",
  "phone": "01811000002"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "def-456-...",
      "name": "Karim Bhai",
      "email": "karim@landlord.com",
      "role": "LANDLORD",
      "status": "ACTIVE"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
📌 **করণীয়:** `data.accessToken` → `landlordToken` ভেরিয়েবলে পেস্ট করুন।

---

### ❌ ভুল ১ — ADMIN রোল দিয়ে রেজিস্ট্রেশন (বন্ধ)
**Request Body:**
```json
{
  "name": "Evil Admin",
  "email": "evil@admin.com",
  "password": "password123",
  "role": "ADMIN",
  "phone": "01900000000"
}
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": {
    "issues": [
      {
        "field": "body.role",
        "message": "Role must be LANDLORD or TENANT"
      }
    ]
  }
}
```

---

### ❌ ভুল ২ — একই ইমেইলে দ্বিতীয়বার রেজিস্ট্রেশন
**Request Body:** (rahim@tenant.com আবার)
```json
{
  "name": "Rahim Mia",
  "email": "rahim@tenant.com",
  "password": "password123",
  "role": "TENANT",
  "phone": "01711000001"
}
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "User already exists",
  "errorDetails": {
    "statusCode": 400,
    "name": "Error",
    "message": "User already exists"
  }
}
```

---

## ধাপ ২ — লগইন

### ✅ Tenant লগইন
```
Method : POST
URL    : {{baseUrl}}/api/auth/login
```
**Request Body:**
```json
{
  "email": "rahim@tenant.com",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### ✅ Admin লগইন (seed থেকে)
```
Method : POST
URL    : {{baseUrl}}/api/auth/login
```
**Request Body:**
```json
{
  "email": "admin@rentnest.com",
  "password": "password123"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
📌 **করণীয়:** `data.accessToken` → `adminToken` এ পেস্ট করুন।

### ❌ ভুল পাসওয়ার্ড
**Request Body:**
```json
{
  "email": "rahim@tenant.com",
  "password": "wrongpassword"
}
```
**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorDetails": {
    "statusCode": 401,
    "message": "Invalid email or password"
  }
}
```

---

## ধাপ ৩ — নিজের প্রোফাইল দেখা

### ✅ GET /api/auth/me
```
Method : GET
URL    : {{baseUrl}}/api/auth/me
Headers: Authorization: Bearer {{tenantToken}}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "abc-123-...",
    "name": "Rahim Mia",
    "email": "rahim@tenant.com",
    "role": "TENANT",
    "status": "ACTIVE",
    "phone": "01711000001",
    "profileImage": null,
    "createdAt": "2026-07-25T07:00:00.000Z",
    "updatedAt": "2026-07-25T07:00:00.000Z"
  }
}
```

### ❌ Token ছাড়া কল করলে
```
Headers: (Authorization হেডার নেই)
```
**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "You are not authorized!",
  "errorDetails": {
    "statusCode": 401,
    "message": "You are not authorized!"
  }
}
```

---

## ধাপ ৪ — Category তৈরি (Admin)

### ✅ Category তৈরি করা
```
Method : POST
URL    : {{baseUrl}}/api/categories
Headers: Authorization: Bearer {{adminToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Apartment",
  "description": "Flat or apartment type properties"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "cat-001-...",
    "name": "Apartment",
    "description": "Flat or apartment type properties",
    "createdAt": "2026-07-25T07:05:00.000Z",
    "updatedAt": "2026-07-25T07:05:00.000Z"
  }
}
```
📌 **করণীয়:** `data.id` কপি করে `categoryId` ভেরিয়েবলে রাখুন।

### ✅ সব Category দেখা (Public)
```
Method : GET
URL    : {{baseUrl}}/api/categories
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "cat-001-...",
      "name": "Apartment",
      "description": "Flat or apartment type properties"
    }
  ]
}
```

### ❌ Tenant দিয়ে Category তৈরির চেষ্টা
```
Headers: Authorization: Bearer {{tenantToken}}
```
**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden access",
  "errorDetails": {
    "statusCode": 403,
    "message": "Forbidden access"
  }
}
```

---

## ধাপ ৫ — Property তৈরি (Landlord)

### ✅ Property তৈরি করা
```
Method : POST
URL    : {{baseUrl}}/api/landlord/properties
Headers: Authorization: Bearer {{landlordToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "title": "সুন্দর ২ বেডরুম ফ্ল্যাট",
  "description": "Mirpur 10 এ একটি চমৎকার ফ্ল্যাট",
  "address": "House 5, Road 3, Block A",
  "city": "Dhaka",
  "price": 15000,
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 950,
  "amenities": ["WiFi", "Parking", "Generator"],
  "categoryId": "{{categoryId}}",
  "images": ["https://example.com/img1.jpg"]
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Property created successfully",
  "data": {
    "id": "prop-789-...",
    "title": "সুন্দর ২ বেডরুম ফ্ল্যাট",
    "description": "Mirpur 10 এ একটি চমৎকার ফ্ল্যাট",
    "address": "House 5, Road 3, Block A",
    "city": "Dhaka",
    "price": "15000",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 950,
    "status": "AVAILABLE",
    "amenities": ["WiFi", "Parking", "Generator"],
    "images": ["https://example.com/img1.jpg"],
    "landlordId": "def-456-...",
    "categoryId": "cat-001-...",
    "createdAt": "2026-07-25T07:10:00.000Z",
    "updatedAt": "2026-07-25T07:10:00.000Z"
  }
}
```
📌 **করণীয়:** `data.id` কপি করে `propertyId` ভেরিয়েবলে রাখুন।

---

### ✅ সব Property দেখা (Public) + ফিল্টার

**শহর দিয়ে ফিল্টার:**
```
GET {{baseUrl}}/api/properties?city=Dhaka
```

**দাম দিয়ে ফিল্টার:**
```
GET {{baseUrl}}/api/properties?minPrice=10000&maxPrice=20000
```

**বেডরুম দিয়ে ফিল্টার:**
```
GET {{baseUrl}}/api/properties?bedrooms=2
```

**Category দিয়ে ফিল্টার:**
```
GET {{baseUrl}}/api/properties?categoryId={{categoryId}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Properties retrieved successfully",
  "data": {
    "properties": [
      {
        "id": "prop-789-...",
        "title": "সুন্দর ২ বেডরুম ফ্ল্যাট",
        "city": "Dhaka",
        "price": "15000",
        "bedrooms": 2,
        "status": "AVAILABLE"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

### ✅ একটি Property আপডেট করা
```
Method : PUT
URL    : {{baseUrl}}/api/landlord/properties/{{propertyId}}
Headers: Authorization: Bearer {{landlordToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "price": 18000,
  "description": "আপডেট করা বিবরণ"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Property updated successfully",
  "data": {
    "id": "prop-789-...",
    "price": "18000",
    "description": "আপডেট করা বিবরণ"
  }
}
```

### ❌ অন্য Landlord property আপডেট করতে চাইলে
```
Headers: Authorization: Bearer {{otherLandlordToken}}
```
**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "You do not own this property",
  "errorDetails": {
    "statusCode": 403,
    "message": "You do not own this property"
  }
}
```

---

## ধাপ ৬ — Rental Request (Tenant)

### ✅ ভাড়ার জন্য Request পাঠানো
```
Method : POST
URL    : {{baseUrl}}/api/rentals
Headers: Authorization: Bearer {{tenantToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "propertyId": "{{propertyId}}",
  "moveInDate": "2026-12-01T00:00:00.000Z",
  "message": "আমি এই ফ্ল্যাটে থাকতে চাই"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Rental request submitted successfully",
  "data": {
    "id": "rent-111-...",
    "status": "PENDING",
    "moveInDate": "2026-12-01T00:00:00.000Z",
    "message": "আমি এই ফ্ল্যাটে থাকতে চাই",
    "tenantId": "abc-123-...",
    "propertyId": "prop-789-...",
    "createdAt": "2026-07-25T07:15:00.000Z",
    "updatedAt": "2026-07-25T07:15:00.000Z"
  }
}
```
📌 **করণীয়:** `data.id` কপি করে `rentalRequestId` ভেরিয়েবলে রাখুন।

---

### ❌ একই Property তে দ্বিতীয়বার Request
```
Body: (একই propertyId দিয়ে আবার)
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "You already have a pending or approved request for this property",
  "errorDetails": {
    "statusCode": 400,
    "message": "You already have a pending or approved request for this property"
  }
}
```

### ❌ অন্য Tenant এর Request দেখার চেষ্টা
```
Method : GET
URL    : {{baseUrl}}/api/rentals/{{rentalRequestId}}
Headers: Authorization: Bearer {{otherTenantToken}}
```
**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden",
  "errorDetails": {
    "statusCode": 403,
    "message": "Forbidden"
  }
}
```

---

## ধাপ ৭ — Landlord Approve/Reject

### ✅ Landlord এর সব Request দেখা
```
Method : GET
URL    : {{baseUrl}}/api/landlord/requests
Headers: Authorization: Bearer {{landlordToken}}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental requests retrieved successfully",
  "data": [
    {
      "id": "rent-111-...",
      "status": "PENDING",
      "property": {
        "id": "prop-789-...",
        "title": "সুন্দর ২ বেডরুম ফ্ল্যাট"
      },
      "tenant": {
        "name": "Rahim Mia",
        "email": "rahim@tenant.com"
      }
    }
  ]
}
```

### ✅ Landlord Request Approve করা
```
Method : PATCH
URL    : {{baseUrl}}/api/landlord/requests/{{rentalRequestId}}
Headers: Authorization: Bearer {{landlordToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "APPROVED"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental status updated successfully",
  "data": {
    "id": "rent-111-...",
    "status": "APPROVED",
    "propertyId": "prop-789-...",
    "tenantId": "abc-123-...",
    "updatedAt": "2026-07-25T07:20:00.000Z"
  }
}
```

### ✅ অথবা Reject করা
**Request Body:**
```json
{
  "status": "REJECTED"
}
```
**Response (200 OK):** একই কিন্তু `"status": "REJECTED"`।

---

## ধাপ ৮ — Payment (Stripe Checkout)

### ✅ Payment Session তৈরি করা
```
Method : POST
URL    : {{baseUrl}}/api/payments/create
Headers: Authorization: Bearer {{tenantToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "rentalRequestId": "{{rentalRequestId}}"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment session created successfully",
  "data": {
    "paymentUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```
📌 **করণীয়:**  
1. `paymentUrl` ব্রাউজারে খুলুন।  
2. Test card: `4242 4242 4242 4242` | Expiry: `12/29` | CVC: `123`।  
3. Payment সম্পন্ন হলে Stripe CLI terminal-এ দেখবেন: `checkout.session.completed`।  
4. তারপর Database-এ:
   - `Payment.status` → `COMPLETED`
   - `RentalRequest.status` → `ACTIVE`
   - `Property.status` → `RENTED`

### ❌ APPROVED নয় এমন Request-এ Payment চাইলে
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Rental request is not APPROVED",
  "errorDetails": {
    "statusCode": 400,
    "message": "Rental request is not APPROVED"
  }
}
```

### ✅ Tenant এর সব Payment দেখা
```
Method : GET
URL    : {{baseUrl}}/api/payments
Headers: Authorization: Bearer {{tenantToken}}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payments retrieved successfully",
  "data": [
    {
      "id": "pay-222-...",
      "amount": "15000",
      "status": "COMPLETED",
      "method": "CARD",
      "provider": "STRIPE",
      "paidAt": "2026-07-25T07:25:00.000Z",
      "rentalRequest": {
        "id": "rent-111-...",
        "property": {
          "title": "সুন্দর ২ বেডরুম ফ্ল্যাট"
        }
      }
    }
  ]
}
```

---

## ধাপ ৯ — Rental Complete করা (Landlord)

### ❌ ACTIVE নয় এমন Request Complete করার চেষ্টা
```
Method : PATCH
URL    : {{baseUrl}}/api/landlord/requests/{{rentalRequestId}}/complete
Headers: Authorization: Bearer {{landlordToken}}
```
**(যদি এখনো PENDING/APPROVED থাকে):**
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Rental request is not ACTIVE",
  "errorDetails": {
    "statusCode": 400,
    "message": "Rental request is not ACTIVE"
  }
}
```

### ✅ সফলভাবে Complete করা (Payment-এর পর)
```
Method : PATCH
URL    : {{baseUrl}}/api/landlord/requests/{{rentalRequestId}}/complete
Headers: Authorization: Bearer {{landlordToken}}
Body   : (body লাগবে না)
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental request marked as completed successfully",
  "data": {
    "id": "rent-111-...",
    "status": "COMPLETED",
    "tenantId": "abc-123-...",
    "propertyId": "prop-789-...",
    "updatedAt": "2026-07-25T07:30:00.000Z"
  }
}
```

---

## ধাপ ১০ — Review দেওয়া (Tenant)

### ❌ COMPLETED নয় এমন Rental-এ Review চেষ্টা
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Rental is not COMPLETED yet",
  "errorDetails": {
    "statusCode": 400,
    "message": "Rental is not COMPLETED yet"
  }
}
```

### ❌ Rating ভুল দিলে (1-5 এর বাইরে)
**Request Body:**
```json
{
  "rentalRequestId": "{{rentalRequestId}}",
  "rating": 6,
  "comment": "দারুণ!"
}
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": {
    "issues": [
      {
        "field": "body.rating",
        "message": "Rating must be an integer between 1 and 5"
      }
    ]
  }
}
```

### ✅ সফলভাবে Review দেওয়া
```
Method : POST
URL    : {{baseUrl}}/api/reviews
Headers: Authorization: Bearer {{tenantToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "rentalRequestId": "{{rentalRequestId}}",
  "rating": 5,
  "comment": "অসাধারণ ফ্ল্যাট, মালিক খুব ভালো মানুষ!"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "id": "rev-333-...",
    "rating": 5,
    "comment": "অসাধারণ ফ্ল্যাট, মালিক খুব ভালো মানুষ!",
    "tenantId": "abc-123-...",
    "propertyId": "prop-789-...",
    "rentalRequestId": "rent-111-...",
    "createdAt": "2026-07-25T07:35:00.000Z",
    "updatedAt": "2026-07-25T07:35:00.000Z"
  }
}
```

### ❌ একই Rental-এ দ্বিতীয়বার Review
**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "You have already reviewed this rental request",
  "errorDetails": {
    "statusCode": 400,
    "message": "You have already reviewed this rental request"
  }
}
```

---

## ধাপ ১১ — Admin প্যানেল

### ✅ সব User দেখা
```
Method : GET
URL    : {{baseUrl}}/api/admin/users
Headers: Authorization: Bearer {{adminToken}}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "abc-123-...",
      "name": "Rahim Mia",
      "email": "rahim@tenant.com",
      "role": "TENANT",
      "status": "ACTIVE"
    },
    {
      "id": "def-456-...",
      "name": "Karim Bhai",
      "email": "karim@landlord.com",
      "role": "LANDLORD",
      "status": "ACTIVE"
    }
  ]
}
```

### ✅ User Ban করা
```
Method : PATCH
URL    : {{baseUrl}}/api/admin/users/{{tenantUserId}}
Headers: Authorization: Bearer {{adminToken}}
         Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "BANNED"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User status updated successfully",
  "data": {
    "id": "abc-123-...",
    "name": "Rahim Mia",
    "status": "BANNED"
  }
}
```

### ❌ Banned User লগইন করতে গেলে
**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "User is banned",
  "errorDetails": {
    "statusCode": 403,
    "message": "User is banned"
  }
}
```

### ❌ Banned User এর পুরনো Token দিয়ে কোনো Request
**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "User is banned",
  "errorDetails": {
    "statusCode": 403,
    "message": "User is banned"
  }
}
```

### ✅ Admin — সব Property দেখা
```
Method : GET
URL    : {{baseUrl}}/api/admin/properties
Headers: Authorization: Bearer {{adminToken}}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Properties retrieved successfully",
  "data": [
    {
      "id": "prop-789-...",
      "title": "সুন্দর ২ বেডরুম ফ্ল্যাট",
      "status": "RENTED",
      "city": "Dhaka"
    }
  ]
}
```

### ✅ Admin — সব Rental দেখা
```
Method : GET
URL    : {{baseUrl}}/api/admin/rentals
Headers: Authorization: Bearer {{adminToken}}
```
**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental requests retrieved successfully",
  "data": [
    {
      "id": "rent-111-...",
      "status": "COMPLETED",
      "property": {
        "title": "সুন্দর ২ বেডরুম ফ্ল্যাট"
      },
      "tenant": {
        "name": "Rahim Mia"
      }
    }
  ]
}
```

---

## ধাপ ১২ — Error Format চেক (সব ক্ষেত্রে একই Pattern)

প্রতিটি Error Response সবসময় এই format অনুসরণ করে:
```json
{
  "success": false,
  "message": "কী ভুল হয়েছে সেটার বার্তা",
  "errorDetails": {
    "statusCode": 400,
    "message": "একই বার্তা বা বিস্তারিত তথ্য"
  }
}
```

Validation Error হলে:
```json
{
  "success": false,
  "message": "Validation failed",
  "errorDetails": {
    "issues": [
      {
        "field": "body.fieldName",
        "message": "কী field ভুল সেটার বার্তা"
      }
    ]
  }
}
```

---

## সম্পূর্ণ ক্রম (Quick Reference)

| ধাপ | Method | Endpoint | Role | Status |
|-----|--------|----------|------|--------|
| 1 | POST | `/api/auth/register` | — | 201 |
| 2 | POST | `/api/auth/login` | — | 200 |
| 3 | GET | `/api/auth/me` | যেকোনো | 200 |
| 4 | POST | `/api/categories` | Admin | 201 |
| 5 | GET | `/api/categories` | Public | 200 |
| 6 | POST | `/api/landlord/properties` | Landlord | 201 |
| 7 | GET | `/api/properties` | Public | 200 |
| 8 | GET | `/api/properties/:id` | Public | 200 |
| 9 | POST | `/api/rentals` | Tenant | 201 |
| 10 | GET | `/api/landlord/requests` | Landlord | 200 |
| 11 | PATCH | `/api/landlord/requests/:id` | Landlord | 200 |
| 12 | POST | `/api/payments/create` | Tenant | 200 |
| 13 | *(Browser)* | Stripe Checkout | — | — |
| 14 | PATCH | `/api/landlord/requests/:id/complete` | Landlord | 200 |
| 15 | POST | `/api/reviews` | Tenant | 201 |
| 16 | GET | `/api/admin/users` | Admin | 200 |
| 17 | PATCH | `/api/admin/users/:id` | Admin | 200 |
| 18 | GET | `/api/admin/properties` | Admin | 200 |
| 19 | GET | `/api/admin/rentals` | Admin | 200 |
| 20 | GET | `/api/payments` | Tenant | 200 |
| 21 | GET | `/api/payments/:id` | Tenant/Admin | 200 |
