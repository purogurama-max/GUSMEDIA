# IMPLEMENTATION PLAN

# Software Company Profile & Software Sales System

> **WAJIB: Project dikerjakan per STEP dan tidak boleh mengeksekusi semua STEP sekaligus.**

---

# 1. PROJECT OBJECTIVE

Membangun website company profile untuk perusahaan yang menjual software.

Sistem terdiri dari:

### Public Website

* Home
* About Company
* Services
* Products
* Product Detail
* Portfolio
* Contact
* Order Software

### Admin Dashboard

* Login
* Dashboard
* Product Management
* Customer Management
* Order Management
* Invoice Management
* Payment Management
* Reports
* Company Settings

### Backend

* Node.js
* Express.js
* JavaScript
* REST API
* JWT Authentication
* PostgreSQL

### Frontend

* JavaScript
* React / Next.js
* Tailwind CSS

---

# 2. PROJECT ARCHITECTURE

Frontend dan backend **WAJIB DIPISAH**.

Struktur utama:

```text
project-root/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── IMPLEMENTATION_PLAN.md
│
└── README.md
```

Arsitektur:

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │    FRONTEND     │
              │ React / Next.js │
              │  JavaScript     │
              └────────┬────────┘
                       │
                       │ REST API
                       ▼
              ┌─────────────────┐
              │     BACKEND     │
              │    Node.js      │
              │    Express.js   │
              │   JavaScript    │
              └────────┬────────┘
                       │
                       │ SQL
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

---

# 3. FRONTEND

Semua kode frontend berada di:

```text
frontend/
```

Frontend bertanggung jawab terhadap:

```text
Company Profile
Product Catalog
Product Detail
Order Form
Admin Dashboard
Invoice Display
Print Invoice
```

Frontend **TIDAK BOLEH**:

```text
Mengakses PostgreSQL secara langsung
Menyimpan database password
Menyimpan JWT secret
Menyimpan private key
Menyimpan credential backend
```

Frontend hanya berkomunikasi dengan backend melalui REST API.

---

# 4. BACKEND

Semua kode backend berada di:

```text
backend/
```

Backend bertanggung jawab terhadap:

```text
Authentication
Authorization
Business Logic
Validation
Product API
Customer API
Order API
Invoice API
Payment API
Database Access
```

Backend adalah satu-satunya bagian aplikasi yang boleh berkomunikasi dengan PostgreSQL.

---

# 5. DATABASE

Database menggunakan:

```text
PostgreSQL
```

Database hanya boleh diakses oleh:

```text
backend/
```

Frontend tidak boleh memiliki database connection.

---

# 6. CORE FILE PROTECTION

## PENTING

Jika project sudah memiliki file atau folder CORE, CORE dianggap sebagai:

```text
READ PROTECTED
WRITE PROTECTED
```

AI Agent **DILARANG** membaca, mengubah, menghapus, memindahkan, atau melakukan refactor terhadap CORE.

Contoh folder CORE:

```text
core/
frontend/core/
backend/core/
src/core/
app/core/
modules/core/
```

Jika ditemukan folder tersebut, jangan dibaca.

---

# 7. JANGAN SCAN SELURUH PROJECT

AI Agent dilarang melakukan recursive scan terhadap seluruh repository.

Jangan menjalankan:

```bash
find .
```

```bash
tree
```

```bash
ls -R
```

```bash
grep -R .
```

atau perintah lain yang membaca seluruh repository.

AI hanya boleh memeriksa file yang diperlukan untuk STEP yang sedang dikerjakan.

---

# 8. FILE SENSITIF

Jangan membaca atau mengubah file berikut kecuali memang diperlukan dan user memberikan izin:

```text
.env
.env.*
*.key
*.pem
*.crt
credentials.*
secrets.*
```

Jangan pernah menampilkan secret kepada user.

Jangan menampilkan:

```text
DATABASE_PASSWORD
JWT_SECRET
API_KEY
PRIVATE_KEY
ACCESS_TOKEN
```

---

# 9. NO AUTOMATIC REFACTOR

AI Agent tidak boleh melakukan refactor project secara keseluruhan.

Dilarang:

```text
Mengubah framework
Mengganti architecture
Mengganti dependency tanpa alasan
Rename file existing
Memindahkan file existing
Menghapus kode existing
Mengubah CORE
Mengubah konfigurasi existing
```

kecuali diminta secara eksplisit.

---

# 10. STEP EXECUTION RULE

Project harus dikerjakan satu STEP pada satu waktu.

Contoh:

```text
LANJUT STEP 1
```

AI hanya mengerjakan:

```text
STEP 1
```

Setelah selesai:

```text
STOP
```

AI tidak boleh otomatis menjalankan STEP 2.

Untuk melanjutkan:

```text
LANJUT STEP 2
```

---

# 11. STEP SCOPE

Setiap STEP memiliki scope.

Contoh:

```text
SCOPE: FRONTEND ONLY
```

berarti AI hanya boleh mengubah:

```text
frontend/
```

Contoh:

```text
SCOPE: BACKEND ONLY
```

berarti AI hanya boleh mengubah:

```text
backend/
```

Contoh:

```text
SCOPE: DATABASE
```

AI hanya boleh mengubah file migration/schema yang diperlukan.

---

# 12. CROSS-SCOPE PROTECTION

Jika sedang mengerjakan frontend dan ternyata backend perlu diubah:

**JANGAN langsung mengubah backend.**

AI harus melaporkan:

```text
Backend change required.

Reason:
<alasan>

Required files:
<file>

Waiting for next STEP.
```

Kemudian STOP.

Hal yang sama berlaku sebaliknya.

---

# 13. TECHNOLOGY STACK

## FRONTEND

Gunakan:

```text
JavaScript
React / Next.js
Tailwind CSS
```

Jika project frontend sudah menggunakan framework tertentu, pertahankan framework tersebut.

Jangan mengganti framework tanpa instruksi user.

---

## BACKEND

Gunakan:

```text
Node.js
Express.js
JavaScript
REST API
JWT
```

---

## DATABASE

```text
PostgreSQL
```

---

# 14. RECOMMENDED PROJECT STRUCTURE

Struktur target:

```text
project-root/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── migrations/
│   ├── package.json
│   └── ...
│
├── docs/
│
├── IMPLEMENTATION_PLAN.md
└── README.md
```

Struktur tersebut adalah target.

Jangan memaksa struktur tersebut jika project existing memiliki struktur berbeda dan masih valid.

---

# 15. PUBLIC WEBSITE

URL utama:

```text
/
```

Halaman:

```text
/
├── Home
├── About
├── Services
├── Products
├── Portfolio
└── Contact
```

---

# 16. HOME PAGE

Home harus memiliki:

```text
Hero
Company Introduction
Software Products
Services
Portfolio
Why Choose Us
Call To Action
Contact
```

Desain harus terlihat seperti website perusahaan software modern.

Hindari desain yang terlihat seperti template lama.

---

# 17. ABOUT COMPANY

Berisi:

```text
Company Profile
Vision
Mission
Experience
Technology
Why Choose Us
```

Data company nantinya dapat dikelola dari Admin Dashboard jika fitur Settings sudah tersedia.

---

# 18. SERVICES

Contoh:

```text
Software Development
Web Development
Mobile Development
System Integration
Database Development
Custom Software
Maintenance
```

Jangan membuat layanan yang tidak diberikan perusahaan sebagai fakta.

Gunakan data konfigurasi jika memungkinkan.

---

# 19. PRODUCTS

Halaman:

```text
/products
```

Menampilkan:

```text
Product Name
Image
Short Description
Price
Category
Status
View Detail
Order
```

---

# 20. PRODUCT DETAIL

Halaman:

```text
/products/:slug
```

Menampilkan:

```text
Product Name
Description
Features
Screenshots
Specifications
Price
Order Button
```

---

# 21. ORDER SYSTEM

Customer dapat memesan software.

Data order:

```text
Order Number
Customer
Product
Quantity
Price
Discount
Tax
Subtotal
Grand Total
Notes
Order Date
Status
```

Status:

```text
PENDING
CONFIRMED
PROCESSING
COMPLETED
CANCELLED
```

---

# 22. ADMIN DASHBOARD

Admin URL:

```text
/admin
```

Menu:

```text
Dashboard

Products
Customers
Orders

Invoices
Payments

Reports

Settings
```

---

# 23. DASHBOARD

Dashboard menampilkan:

```text
Total Products
Total Customers
Total Orders
Pending Orders
Completed Orders
Total Revenue
Outstanding Invoice
```

Data harus berasal dari database.

Jangan membuat angka production palsu.

---

# 24. PRODUCT MANAGEMENT

Admin dapat:

```text
Create
Read
Update
Delete
Search
Filter
Activate
Deactivate
```

Product:

```text
id
name
slug
description
price
category_id
image
status
created_at
updated_at
```

Status:

```text
ACTIVE
INACTIVE
```

---

# 25. CUSTOMER MANAGEMENT

Customer:

```text
id
name
email
phone
company
address
created_at
updated_at
```

Admin dapat:

```text
Create
Read
Update
Delete
Search
View Detail
```

---

# 26. ORDER MANAGEMENT

Admin dapat:

```text
View Order
View Order Detail
Update Status
Print Order
Create Invoice
```

Order detail:

```text
Order Number
Customer
Product
Quantity
Price
Subtotal
Discount
Tax
Grand Total
Status
Created Date
Notes
```

---

# 27. INVOICE

Invoice harus menggunakan format:

```text
A4
```

Isi:

```text
Company Logo
Company Name
Company Address
Company Contact

Invoice Number
Invoice Date

Customer Information

Order Information

Product
Quantity
Price
Subtotal

Discount
Tax

Grand Total

Payment Status

Notes

Signature
```

---

# 28. INVOICE NUMBER

Invoice number harus unique.

Format:

```text
INV-2026-000001
INV-2026-000002
INV-2026-000003
```

Pembuatan nomor invoice harus dilakukan di backend.

Jangan membuat nomor invoice hanya berdasarkan frontend.

---

# 29. PRINT INVOICE

Invoice harus dapat dicetak menggunakan browser.

Flow:

```text
Admin
  |
  ▼
Invoice Detail
  |
  ▼
Print Invoice
  |
  ▼
Browser Print
  |
  ├── Printer
  │
  └── Save PDF
```

Gunakan:

```css
@media print {
}
```

Saat print:

```text
Sidebar tidak tampil
Navbar tidak tampil
Button tidak tampil
Menu admin tidak tampil
```

Yang tampil hanya invoice.

---

# 30. PAYMENT

Payment:

```text
id
invoice_id
payment_date
amount
payment_method
status
notes
```

Status:

```text
UNPAID
PARTIAL
PAID
```

Outstanding:

```text
Outstanding = Grand Total - Total Payment
```

Jangan menghitung nilai payment hanya dari frontend.

---

# 31. DATABASE TABLES

Minimal:

```text
users
customers
categories
products
orders
order_items
invoices
payments
company_settings
```

Relasi:

```text
customers
    |
    └── orders
          |
          └── order_items
                |
                └── products

orders
    |
    └── invoices
          |
          └── payments
```

---

# 32. API ARCHITECTURE

Frontend:

```text
frontend
    |
    | REST API
    ▼
backend
    |
    | SQL
    ▼
PostgreSQL
```

Frontend tidak boleh:

```text
frontend → PostgreSQL
```

Yang diperbolehkan:

```text
frontend → backend → PostgreSQL
```

---

# 33. API ENDPOINT

Endpoint dibuat secara bertahap.

Contoh:

```text
POST   /api/auth/login

GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id

GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id

GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id

GET    /api/payments
POST   /api/payments
```

Jangan membuat seluruh endpoint dalam satu STEP.

---

# 34. AUTHENTICATION

Admin menggunakan:

```text
JWT
```

Password:

```text
HASHED
```

Jangan menyimpan password plaintext.

Authentication middleware digunakan untuk endpoint admin.

---

# 35. AUTHORIZATION

Tidak semua endpoint boleh diakses public.

Contoh:

```text
GET /api/products
```

dapat public.

Sedangkan:

```text
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

harus membutuhkan authentication.

---

# 36. VALIDATION

Validation harus dilakukan di:

```text
Frontend
Backend
Database
```

Backend tidak boleh percaya terhadap data dari frontend.

---

# 37. ERROR RESPONSE

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Product not found"
}
```

Validation:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

---

# 38. SECURITY

Perhatikan:

```text
SQL Injection
XSS
CSRF
CORS
JWT
Password Hashing
Input Validation
Authorization
Sensitive Information
Environment Variables
```

Secret tidak boleh masuk Git.

---

# 39. DEVELOPMENT STEPS

Project dibangun dalam urutan:

```text
STEP 1   - Safe Project Inspection
STEP 2   - Frontend Project Setup
STEP 3   - Frontend Company Profile
STEP 4   - Frontend Product Catalog
STEP 5   - Backend Project Setup
STEP 6   - PostgreSQL Database
STEP 7   - Product API
STEP 8   - Connect Product Frontend To API
STEP 9   - Customer API
STEP 10  - Order API
STEP 11  - Admin Authentication
STEP 12  - Admin Dashboard
STEP 13  - Admin Product Management
STEP 14  - Admin Customer Management
STEP 15  - Admin Order Management
STEP 16  - Invoice Backend
STEP 17  - Invoice Frontend
STEP 18  - Print Invoice
STEP 19  - Payment System
STEP 20  - Dashboard Statistics
STEP 21  - Testing
STEP 22  - Security Review
STEP 23  - Final Integration
```

---

# 40. STEP 1 — SAFE PROJECT INSPECTION

## Scope

```text
ROOT ONLY
```

Tujuan:

Memahami struktur project tanpa membaca CORE.

### Yang boleh diperiksa

```text
package.json
README.md
struktur folder level pertama
```

Jika frontend/backend sudah ada, hanya periksa informasi minimum yang diperlukan.

### DILARANG

```text
Membaca CORE
Membaca source code secara recursive
Membaca seluruh repository
Mengubah source code
Mengubah database
```

### Output

AI harus memberikan:

```text
Project Type:
Frontend:
Backend:
Database:
Existing Structure:
Protected Directories:
Potential Conflict:
```

Tidak membuat fitur.

Setelah selesai:

```text
STEP 1 COMPLETED

WAITING FOR:
LANJUT STEP 2
```

STOP.

---

# 41. STEP 2 — FRONTEND PROJECT SETUP

## Scope

```text
FRONTEND ONLY
```

Tujuan:

Menyiapkan:

```text
frontend/
```

Pastikan frontend dapat dijalankan.

Contoh:

```bash
npm install
npm run dev
```

Jangan membuat backend.

Jangan membuat database.

STOP setelah selesai.

---

# 42. STEP 3 — FRONTEND COMPANY PROFILE

## Scope

```text
FRONTEND ONLY
```

Buat:

```text
Home
About
Services
Portfolio
Contact
```

Jangan membuat:

```text
Backend
Database
Authentication
Invoice
Payment
```

STOP.

---

# 43. STEP 4 — FRONTEND PRODUCT CATALOG

## Scope

```text
FRONTEND ONLY
```

Buat:

```text
Products
Product Detail
```

Jika backend belum tersedia, gunakan mock data sementara.

Jangan membuat database.

STOP.

---

# 44. STEP 5 — BACKEND PROJECT SETUP

## Scope

```text
BACKEND ONLY
```

Buat:

```text
backend/
```

Setup:

```text
Node.js
Express.js
JavaScript
REST API
Error Handler
Environment Configuration
```

Jangan membuat Product API dulu.

STOP.

---

# 45. STEP 6 — POSTGRESQL DATABASE

## Scope

```text
BACKEND DATABASE
```

Buat schema/migration:

```text
users
customers
categories
products
orders
order_items
invoices
payments
company_settings
```

Jangan menghapus database existing.

Jangan melakukan destructive migration.

STOP.

---

# 46. STEP 7 — PRODUCT API

## Scope

```text
BACKEND ONLY
```

Implement:

```text
GET products
GET product
POST product
PUT product
DELETE product
```

Tambahkan:

```text
Validation
Error Handling
Database Access
```

STOP.

---

# 47. STEP 8 — CONNECT PRODUCT FRONTEND TO API

## Scope

```text
FRONTEND ONLY
```

Hubungkan frontend Product Catalog ke:

```text
/api/products
```

Frontend tidak boleh mengakses database.

STOP.

---

# 48. STEP 9 — CUSTOMER API

## Scope

```text
BACKEND ONLY
```

Implement CRUD:

```text
Customer
```

STOP.

---

# 49. STEP 10 — ORDER API

## Scope

```text
BACKEND ONLY
```

Implement:

```text
Create Order
Get Orders
Get Order Detail
Update Order Status
```

Perhitungan:

```text
Subtotal
Discount
Tax
Grand Total
```

harus dilakukan dengan benar.

STOP.

---

# 50. STEP 11 — ADMIN AUTHENTICATION

## Scope

```text
BACKEND ONLY
```

Implement:

```text
Login
JWT
Password Hash
Authentication Middleware
Authorization
```

STOP.

---

# 51. STEP 12 — ADMIN DASHBOARD

## Scope

```text
FRONTEND ONLY
```

Buat:

```text
/admin
```

Menu:

```text
Dashboard
Products
Customers
Orders
Invoices
Payments
Reports
Settings
```

Pada tahap ini fokus pada UI/navigation.

STOP.

---

# 52. STEP 13 — ADMIN PRODUCT MANAGEMENT

## Scope

```text
FRONTEND ONLY
```

Implement UI:

```text
List
Create
Edit
Delete
Search
Filter
Status
```

Gunakan Product API yang sudah tersedia.

STOP.

---

# 53. STEP 14 — ADMIN CUSTOMER MANAGEMENT

## Scope

```text
FRONTEND ONLY
```

Implement:

```text
List
Create
Edit
Delete
Search
Detail
```

Gunakan Customer API.

STOP.

---

# 54. STEP 15 — ADMIN ORDER MANAGEMENT

## Scope

```text
FRONTEND ONLY
```

Implement:

```text
Order List
Order Detail
Update Status
Print Order
Create Invoice
```

STOP.

---

# 55. STEP 16 — INVOICE BACKEND

## Scope

```text
BACKEND ONLY
```

Implement:

```text
Invoice
Invoice Number
Invoice Calculation
Invoice Status
```

Invoice number harus unique.

Format:

```text
INV-YYYY-NNNNNN
```

STOP.

---

# 56. STEP 17 — INVOICE FRONTEND

## Scope

```text
FRONTEND ONLY
```

Buat halaman:

```text
/admin/invoices/:id
```

Tampilkan:

```text
Company
Customer
Invoice Number
Invoice Date
Products
Subtotal
Discount
Tax
Grand Total
Payment Status
Notes
Signature
```

STOP.

---

# 57. STEP 18 — PRINT INVOICE

## Scope

```text
FRONTEND ONLY
```

Invoice harus:

```text
A4
Print Friendly
Save as PDF
```

Saat print sembunyikan:

```text
Sidebar
Navbar
Button
Admin Menu
```

Gunakan:

```css
@media print {
  /* hide sidebar, navbar, buttons, admin menu */
}
```

STOP.

---

# 58. STEP 19 — PAYMENT SYSTEM

## Scope

```text
BACKEND ONLY
```

Implement:

```text
Create Payment
Get Payments
Payment History
Payment Status
Outstanding
```

Status:

```text
UNPAID
PARTIAL
PAID
```

STOP.

---

# 59. STEP 20 — DASHBOARD STATISTICS

## Scope

```text
BACKEND + FRONTEND
```

Backend menyediakan statistik.

Frontend menampilkan:

```text
Total Revenue
Orders
Customers
Products
Pending Orders
Completed Orders
Outstanding
```

Hanya lakukan perubahan yang diperlukan untuk integrasi.

STOP.

---

# 60. STEP 21 — TESTING

## Scope

```text
FRONTEND + BACKEND
```

Test:

```text
Login
Product
Customer
Order
Invoice
Payment
Print Invoice
```

API status:

```text
200
201
400
401
403
404
500
```

STOP.

---

# 61. STEP 22 — SECURITY REVIEW

## Scope

```text
FRONTEND + BACKEND
```

Periksa:

```text
Authentication
Authorization
JWT
Password Hash
SQL Injection
XSS
CORS
Input Validation
Environment Variables
Sensitive Logs
```

Jangan melakukan refactor besar.

STOP.

---

# 62. STEP 23 — FINAL INTEGRATION

## Scope

```text
FRONTEND + BACKEND
```

Pastikan flow:

```text
Public Website
      |
      ▼
Products
      |
      ▼
Order
      |
      ▼
Backend
      |
      ▼
PostgreSQL
      |
      ▼
Admin
      |
      ▼
Invoice
      |
      ▼
Payment
      |
      ▼
Print Invoice
```

Lakukan final test.

Jangan mengubah CORE.

STOP.

---

# 63. RESPONSE FORMAT

Setelah setiap STEP selesai, AI harus memberikan:

```text
STEP X COMPLETED

Scope:
<scope>

Changes:
- ...
- ...

Files Created:
- ...

Files Modified:
- ...

Tests:
- ...

Problems:
- ...

Next Step:
STEP X+1

Waiting for:
LANJUT STEP X+1
```

Kemudian STOP.

---

# 64. WHEN SOMETHING IS UNCLEAR

Jika AI tidak yakin:

```text
JANGAN MENEBAK.
```

Jangan mengubah file yang belum diketahui.

Jangan membaca CORE untuk mencari jawaban.

Tulis:

```text
UNCLEAR

File:
<file>

Reason:
<reason>

Required action:
<action>

Waiting for user instruction.
```

STOP.

---

# 65. ABSOLUTE RULES

Rules berikut memiliki prioritas tertinggi:

```text
1.  Jangan mengerjakan semua STEP sekaligus.
2.  Hanya kerjakan STEP yang diperintahkan user.
3.  Setelah STEP selesai harus STOP.
4.  Jangan membaca CORE.
5.  Jangan mengubah CORE.
6.  Jangan melakukan recursive repository scan.
7.  Jangan mengubah frontend ketika scope backend-only.
8.  Jangan mengubah backend ketika scope frontend-only.
9.  Jangan mengakses PostgreSQL dari frontend.
10. Jangan menyimpan secret di frontend.
11. Jangan melakukan destructive database migration.
12. Jangan melakukan refactor besar tanpa izin.
13. Jangan menghapus file existing.
14. Jangan mengganti framework tanpa izin.
15. Jika membutuhkan perubahan di luar scope, laporkan dan STOP.
```

---

# 66. USER COMMAND

User akan mengontrol proses menggunakan:

```text
LANJUT STEP 1
LANJUT STEP 2
LANJUT STEP 3
LANJUT STEP 4
...
LANJUT STEP 23
```

AI wajib mengikuti STEP yang diberikan.

Tidak boleh melompat STEP kecuali user meminta.

---

# 67. FINAL RULE

> **DO NOT BUILD EVERYTHING AT ONCE.**
>
> **DO NOT READ CORE.**
>
> **DO NOT MODIFY CORE.**
>
> **FRONTEND AND BACKEND MUST REMAIN SEPARATED.**
>
> **ONE STEP AT A TIME.**
>
> **WAIT FOR USER COMMAND BEFORE CONTINUING.**

---

# END
