# PROJECT HISTORY

# Software Company Profile & Software Sales System

> File ini digunakan untuk mencatat history pengerjaan project.
> Update file ini setiap kali sebuah STEP selesai dikerjakan.

---

## 📋 PROJECT INFO

| Item | Detail |
|------|--------|
| **Project Name** | Software Company Profile & Sales System |
| **Stack Frontend** | React / Next.js + Tailwind CSS |
| **Stack Backend** | Node.js + Express.js |
| **Database** | PostgreSQL |
| **Started** | 2026-09-10 |
| **Last Updated** | 2026-09-11 |
| **Current Step** | STEP 23 (Final Integration) - All Steps Completed |

---

## 🗺️ STEP OVERVIEW

| Step | Name | Status | Tanggal |
|------|------|--------|---------|
| STEP 1  | Safe Project Inspection       | ✅ Selesai | 2026-09-10 |
| STEP 2  | Frontend Project Setup        | ✅ Selesai | 2026-09-10 |
| STEP 3  | Frontend Company Profile      | ✅ Selesai | 2026-09-10 |
| STEP 4  | Frontend Product Catalog      | ✅ Selesai | 2026-09-10 |
| STEP 5  | Backend Project Setup         | ✅ Selesai | 2026-09-10 |
| STEP 6  | PostgreSQL Database           | ✅ Selesai | 2026-09-10 |
| STEP 7  | Product API                   | ✅ Selesai | 2026-09-11 |
| STEP 8  | Connect Product Frontend→API  | ✅ Selesai | 2026-09-11 |
| STEP 9  | Customer API                  | ✅ Selesai | 2026-09-11 |
| STEP 10 | Order API                     | ✅ Selesai | 2026-09-11 |
| STEP 11 | Admin Authentication          | ✅ Selesai | 2026-09-11 |
| STEP 12 | Admin Dashboard               | ✅ Selesai | 2026-09-11 |
| STEP 13 | Admin Product Management      | ✅ Selesai | 2026-09-11 |
| STEP 14 | Admin Customer Management     | ✅ Selesai | 2026-09-11 |
| STEP 15 | Admin Order Management        | ✅ Selesai | 2026-09-11 |
| STEP 16 | Invoice Backend               | ✅ Selesai | 2026-09-11 |
| STEP 17 | Invoice Frontend              | ✅ Selesai | 2026-09-11 |
| STEP 18 | Print Invoice                 | ✅ Selesai | 2026-09-11 |
| STEP 19 | Payment System                | ✅ Selesai | 2026-09-11 |
| STEP 20 | Dashboard Statistics          | ✅ Selesai | 2026-09-11 |
| STEP 21 | Testing                       | ✅ Selesai | 2026-09-11 |
| STEP 22 | Security Review               | ✅ Selesai | 2026-09-11 |
| STEP 23 | Final Integration             | ✅ Selesai | 2026-09-11 |

**Legend:** ⬜ Belum &nbsp;|&nbsp; 🔄 Sedang Dikerjakan &nbsp;|&nbsp; ✅ Selesai &nbsp;|&nbsp; ❌ Error / Blocked

---

## 📁 PROJECT STRUCTURE (Saat Ini)

> Update bagian ini setiap kali ada folder/file baru yang dibuat.

```text
Dashboard_Penjulan/
│
├── IMPLEMENTATION_PLAN.md   ✅ Ada
├── PROJECT_HISTORY.md       ✅ Ada (file ini)
├── README.md                ⬜ Belum dibuat
│
├── frontend/                ✅ Dibuat (Catalog & Product Detail Ready)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── services/
│   │   │   ├── productService.js
│   │   │   └── customerService.js
│   │   ├── utils/
│   │   │   └── mockProducts.js
│   │   └── app/
│   │       ├── globals.css
│   │       ├── layout.js
│   │       ├── page.js (Home)
│   │       ├── about/page.js
│   │       ├── services/page.js
│   │       ├── portfolio/page.js
│   │       ├── contact/page.js
│   │       ├── products/
│   │       │   ├── page.js (Catalog)
│   │       │   └── [slug]/page.js (Detail & Order Form)
│   │       └── admin/
│   │           ├── layout.js
│   │           ├── page.js
│   │           ├── products/page.js
│   │           └── customers/page.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                 ✅ Dibuat (Express, PostgreSQL Pool, Migrations)
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── routes/
│   │       └── health.routes.js
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── runMigration.js
│   ├── .env
│   ├── .env.example
│   └── package.json
└── docs/                    ⬜ Belum dibuat
```

---

## 🔧 ENVIRONMENT & CONFIG

> Catat konfigurasi penting di sini (TANPA nilai secret).

| Item | Keterangan |
|------|-----------|
| **Node.js version** | Active System Node |
| **npm version** | Active System npm |
| **Frontend framework** | Next.js 14 (App Router, JS, Tailwind CSS, Lucide Icons) |
| **Backend framework** | Express.js (Port 5000) |
| **PostgreSQL version** | Configured in .env (DB_NAME: sales_dashboard_db) |
| **Frontend port** | 3000 (default dev server) |
| **Backend port** | 5000 |
| **DB Name** | sales_dashboard_db |
| **DB Host** | localhost |

---

## 📝 CHANGELOG / HISTORY PENGERJAAN

---

### 🟡 STEP 0 — PROJECT INITIALIZATION

- **Tanggal:** 2026-09-10
- **Status:** ✅ Selesai
- **Dikerjakan:**
  - [x] Membuat `IMPLEMENTATION_PLAN.md`
  - [x] Membuat `PROJECT_HISTORY.md` (file ini)

---

### ✅ STEP 1 — SAFE PROJECT INSPECTION

- **Tanggal:** 2026-09-10
- **Scope:** ROOT ONLY
- **Status:** ✅ Selesai

---

### ✅ STEP 2 — FRONTEND PROJECT SETUP

- **Tanggal:** 2026-09-10
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

---

### ✅ STEP 3 — FRONTEND COMPANY PROFILE

- **Tanggal:** 2026-09-10
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

---

### ✅ STEP 4 — FRONTEND PRODUCT CATALOG

- **Tanggal:** 2026-09-10
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

---

### ✅ STEP 5 — BACKEND PROJECT SETUP

- **Tanggal:** 2026-09-10
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

---

### ✅ STEP 6 — POSTGRESQL DATABASE

- **Tanggal:** 2026-09-10
- **Scope:** BACKEND DATABASE
- **Status:** ✅ Selesai

#### Tables Created (Migration Schema)
```
- users (id, name, email, password, role, timestamps)
- customers (id, name, email, phone, company, address, timestamps)
- categories (id, name, slug, description, timestamps)
- products (id, name, slug, description, price, category_id, image, status, timestamps)
- orders (id, order_number, customer_id, subtotal, discount, tax, grand_total, notes, order_date, status, timestamps)
- order_items (id, order_id, product_id, quantity, price, subtotal, timestamps)
- invoices (id, invoice_number, order_id, issue_date, due_date, subtotal, discount, tax, grand_total, payment_status, notes, timestamps)
- payments (id, invoice_id, payment_date, amount, payment_method, status, notes, timestamps)
- company_settings (id, company_name, company_email, company_phone, company_address, company_logo, timestamps)
```

#### Migration Files
```
- backend/migrations/001_initial_schema.sql
- backend/migrations/runMigration.js
- backend/src/config/db.js (pg Pool connection)
```

#### Notes
```
Schema DDL non-destructive (`CREATE TABLE IF NOT EXISTS`) telah disiapkan beserta script runner migration.
```

---

### ✅ STEP 7 — PRODUCT API

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

#### Endpoints Implemented
```
- GET /api/products (List products with filter, search, & pagination)
- GET /api/products/:id (Get product by ID)
- GET /api/products/slug/:slug (Get product by slug)
- POST /api/products (Create new product with validation & auto-slug)
- PUT /api/products/:id (Update product details)
- DELETE /api/products/:id (Delete product by ID)
```

#### Files Created / Verified
```
- backend/src/controllers/product.controller.js
- backend/src/models/product.model.js
- backend/src/routes/product.routes.js
- backend/src/app.js (Mounted at /api/products)
```

#### Notes
```
Endpoints sudah diuji dan siap digunakan untuk integrasi ke frontend pada STEP 8.
```

---

### ✅ STEP 8 — CONNECT PRODUCT FRONTEND TO API

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Services Created
```
- frontend/src/services/productService.js (fetchProducts, fetchProductBySlug, formatCurrency)
```

#### Files Modified
```
- frontend/src/app/products/page.js (Dynamic server fetch from /api/products)
- frontend/src/app/products/[slug]/page.js (Dynamic server fetch from /api/products/slug/:slug)
```

#### Notes
```
Halaman katalog produk dan detail produk di frontend kini terhubung langsung ke REST API Backend. Next.js build sukses tanpa error.
```

---

### ✅ STEP 9 — CUSTOMER API

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

#### Endpoints Implemented
```
- GET /api/customers (List customers with search & pagination)
- GET /api/customers/:id (Get customer by ID)
- POST /api/customers (Create new customer with validation & duplicate check)
- PUT /api/customers/:id (Update customer details)
- DELETE /api/customers/:id (Delete customer by ID)
```

#### Files Created / Modified
```
- backend/src/models/customer.model.js
- backend/src/controllers/customer.controller.js
- backend/src/routes/customer.routes.js
- backend/src/app.js (Mounted at /api/customers)
```

#### Notes
```
CRUD Customer API telah diimplementasikan lengkap beserta error handler dan validasi email.
```

---

### ✅ STEP 10 — ORDER API

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

#### Endpoints Implemented
```
- GET /api/orders (List orders with filter, search, & pagination)
- GET /api/orders/:id (Get order detail with order items & customer info)
- POST /api/orders (Create order with auto order number generation & transaction rollback)
- PUT /api/orders/:id/status (Update order status: PENDING, CONFIRMED, PROCESSING, COMPLETED, CANCELLED)
```

#### Files Created / Modified
```
- backend/src/models/order.model.js
- backend/src/controllers/order.controller.js
- backend/src/routes/order.routes.js
- backend/src/app.js (Mounted at /api/orders)
```

#### Order Number Format
```
ORD-YYYYMMDD-XXXX (contoh: ORD-20260911-0001)
```

#### Notes
```
Order API menggunakan transaksi PostgreSQL (BEGIN/COMMIT/ROLLBACK) untuk memastikan keutuhan data antara orders & order_items.
```

---

### ✅ STEP 11 — ADMIN AUTHENTICATION

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

#### Endpoints Implemented
```
- POST /api/auth/login (Login admin & generate JWT token)
- GET /api/auth/me (Get active logged-in user profile, protected by verifyToken)
```

#### Files Created / Modified
```
- backend/src/models/user.model.js (Bcrypt password hashing & verification)
- backend/src/middleware/auth.middleware.js (JWT verifyToken & requireRole authorization)
- backend/src/controllers/auth.controller.js
- backend/src/routes/auth.routes.js
- backend/src/app.js (Mounted at /api/auth)
```

#### Notes
```
Sistem autentikasi Admin menggunakan JWT & Bcrypt password hashing dengan penanganan keamanan (HTTP status 401 & 403) yang telah teruji.
```

---

### ✅ STEP 12 — ADMIN DASHBOARD

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Pages & Layout Created
```
- frontend/src/app/admin/layout.js (Admin Sidebar navigation & Top Bar)
- frontend/src/app/admin/page.js (Admin Overview & Metrics Dashboard)
- frontend/src/app/admin/products/page.js (Placeholder module)
- frontend/src/app/admin/customers/page.js (Placeholder module)
- frontend/src/app/admin/orders/page.js (Placeholder module)
- frontend/src/app/admin/invoices/page.js (Placeholder module)
- frontend/src/app/admin/payments/page.js (Placeholder module)
- frontend/src/app/admin/reports/page.js (Placeholder module)
- frontend/src/app/admin/settings/page.js (Placeholder module)
```

#### Notes
```
Layout Admin Dashboard lengkap dengan navigasi sidebar (Dashboard, Products, Customers, Orders, Invoices, Payments, Reports, Settings) telah siap.
```

---

### ✅ STEP 13 — ADMIN PRODUCT MANAGEMENT

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Features Implemented
```
- List Products Table (ditingkatkan dengan status badge, format IDR, & deskripsi)
- Realtime Search & Status Filter (Active / Inactive)
- Modal Form Create Product (Validasi nama & harga wajib)
- Modal Form Edit Product (Update detail produk real-time)
- Confirmation Dialog Delete Product
```

#### Files Modified
```
- frontend/src/services/productService.js (Menambahkan createProductApi, updateProductApi, deleteProductApi)
- frontend/src/app/admin/products/page.js (Full Client UI & CRUD State Management)
```

#### Notes
```
Manajemen Produk Admin pada frontend telah terhubung penuh ke API Backend dan lulus verifikasi Next.js build.
```

---

### ✅ STEP 14 — ADMIN CUSTOMER MANAGEMENT

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Features Implemented
```
- Customer Table List (menampilkan ID, Nama, Email, Telepon, Perusahaan, & Alamat)
- Realtime Search (berdasarkan Nama, Email, atau Perusahaan)
- Modal View Detail Customer (profil lengkap & tanggal terdaftar)
- Modal Form Create Customer (dengan validasi nama & email wajib)
- Modal Form Edit Customer (update profil pelanggan secara real-time)
- Confirmation Dialog Delete Customer
```

#### Files Created / Modified
```
- frontend/src/services/customerService.js (Service wrapper API customer: fetch, create, update, delete)
- frontend/src/app/admin/customers/page.js (Full Client UI & State Management)
```

#### Notes
```
Manajemen Pelanggan (Customer Management) pada frontend Admin telah terintegrasi dengan REST API Backend.
```

---

### ✅ STEP 15 — ADMIN ORDER MANAGEMENT

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Features Implemented
```
- Order List Table (Nomor Order, Nama Pelanggan, Tanggal, Status Badge, & Grand Total IDR)
- Realtime Search & Status Filter (Pending, Confirmed, Processing, Completed, Cancelled)
- Order Detail Modal (Informasi Pemesan, Meta Order, & Tabel Item Software yang Dipesan)
- Order Status Quick Update Dropdown (Realtime sync dengan Backend API)
- Print Order Summary (Tampilan cetak ringkasan pesanan dengan styling CSS media print)
- Create Invoice Trigger (Persiapan integrasi pembuatan invoice otomatis di STEP 16 & 17)
```

#### Files Created / Modified
```
- frontend/src/services/orderService.js (Service wrapper API Order: fetch, getById, updateStatus)
- frontend/src/app/admin/orders/page.js (Full Client UI & Order Management State)
```

#### Notes
```
Manajemen Pesanan Admin pada frontend telah terhubung penuh ke REST API Backend.
```

---

### ✅ STEP 16 — INVOICE BACKEND

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

#### Endpoints Implemented
```
- GET /api/invoices (List invoices with filter, search, & pagination)
- GET /api/invoices/:id (Get invoice detail with order, customer & items)
- POST /api/invoices (Create invoice from order with auto-generated unique INV-YYYY-NNNNNN number)
- PUT /api/invoices/:id/status (Update invoice payment status: UNPAID, PARTIAL, PAID)
```

#### Files Created / Modified
```
- backend/src/models/invoice.model.js
- backend/src/controllers/invoice.controller.js
- backend/src/routes/invoice.routes.js
- backend/src/app.js (Mounted at /api/invoices)
```

#### Invoice Number Format
```
INV-YYYY-NNNNNN (contoh: INV-2026-000001)
```

#### Notes
```
Backend Invoice API diimplementasikan lengkap beserta perhitungan otomatis (subtotal, diskon, pajak, grand total, tanggal jatuh tempo, & status pembayaran).
```

---

### ✅ STEP 17 — INVOICE FRONTEND

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Features Implemented
```
- Invoice List Table (Nomor Invoice, Ref Order, Nama Pelanggan, Tanggal Terbit/Jatuh Tempo, Grand Total, Badge Status Pembayaran)
- Realtime Search & Payment Status Filter (UNPAID, PARTIAL, PAID)
- Modal Form Generate Invoice dari Order (pilihan jangka waktu jatuh tempo Net 7, 14, 30, 60 hari & catatan pembayaran)
- Halaman Rincian Dokumen Invoice /admin/invoices/[id] (Format A4 lengkap: Header Perusahaan, Data Pelanggan, Tabel Produk, Subtotal, Diskon, Pajak, Grand Total, Catatan, & Blok Tanda Tangan)
- Quick Update Status Pembayaran (Sync realtime ke backend)
```

#### Files Created / Modified
```
- frontend/src/services/invoiceService.js (Service wrapper API Invoice: fetch, getById, createFromOrder, updateStatus)
- frontend/src/app/admin/invoices/page.js (Invoices Table & Generate Modal)
- frontend/src/app/admin/invoices/[id]/page.js (Full A4 Invoice Document View)
```

#### Notes
```
Invoice Frontend telah terhubung penuh ke REST API Backend Invoice dan siap digunakan untuk pratinjau serta cetak invoice.
```

---

### ✅ STEP 18 — PRINT INVOICE

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND ONLY
- **Status:** ✅ Selesai

#### Implemented
```
- @media print rule di globals.css: sembunyikan aside (sidebar), header, nav, button, & elemen .print:hidden saat cetak
- @page A4 portrait margin 15mm untuk layout cetak dokumen standar bisnis
- body background putih & teks hitam saat print
- print:hidden di <aside> (sidebar) dan <header> (navbar) pada admin/layout.js
- print:hidden pada Action Bar (tombol Print, Back, Status Changer) di halaman /admin/invoices/[id]
- print:* variant Tailwind pada seluruh elemen Invoice Document Box untuk tampilan bersih A4
- window.print() handler pada tombol "Print Invoice (A4)" di halaman invoice detail
```

#### Files Modified
```
- frontend/src/app/globals.css (@media print rules + @page A4 declaration)
- frontend/src/app/admin/layout.js (print:hidden pada sidebar & header)
- frontend/src/app/admin/invoices/[id]/page.js (print:hidden action bar & print:* variant seluruh dokumen)
```

#### Notes
```
Invoice dapat langsung dicetak sebagai dokumen A4 atau disimpan PDF via browser (Ctrl+P / Print Invoice button). Sidebar, navbar, button aksi, dan kontrol admin tersembunyi saat mode cetak.
```

---

### ✅ STEP 19 — PAYMENT SYSTEM

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND ONLY
- **Status:** ✅ Selesai

#### Endpoints Implemented
```
- POST /api/payments           (Record pembayaran baru ke invoice)
- GET  /api/payments           (List semua pembayaran, filter by invoice_id)
- GET  /api/payments/outstanding         (Daftar invoice belum lunas: UNPAID & PARTIAL)
- GET  /api/payments/history/:invoiceId  (Riwayat pembayaran per invoice + kalkulasi outstanding)
```

#### Payment Status Auto-Calculation
```
- Setelah setiap pembayaran dicatat, total_paid dihitung ulang secara otomatis.
- Invoice payment_status diperbarui otomatis:
    total_paid = 0              -> UNPAID
    0 < total_paid < grand_total -> PARTIAL  
    total_paid >= grand_total   -> PAID
```

#### Payment Methods Supported
```
TRANSFER, CASH, CREDIT_CARD, DEBIT_CARD, EWALLET, CHEQUE
```

#### Files Created / Modified
```
- backend/src/models/payment.model.js
- backend/src/controllers/payment.controller.js
- backend/src/routes/payment.routes.js
- backend/src/app.js (Mounted at /api/payments)
```

#### Notes
```
Pembayaran dicatat menggunakan database transaction (BEGIN/COMMIT/ROLLBACK) untuk menjamin konsistensi data antara tabel payments dan invoice payment_status.
```

---

### ✅ STEP 20 — DASHBOARD STATISTICS

- **Tanggal:** 2026-09-11
- **Scope:** BACKEND + FRONTEND
- **Status:** ✅ Selesai

#### Backend — Endpoint Implemented
```
- GET /api/stats (7 KPI sekaligus via parallel Promise.all queries)
  Response: total_revenue, total_orders, total_customers, total_products,
            pending_orders, completed_orders, total_outstanding
```

#### Frontend — Dashboard Diperbarui
```
- 4 KPI Metric Cards: Total Revenue, Total Orders, Total Customers, Active Products
- 3 Status Overview Rows: Pending Orders, Completed Orders, Outstanding Receivables
- Quick Action Shortcuts (Products, Customers, Orders, Invoices)
- Revenue Summary Box di panel Quick Actions
- Skeleton loading animation saat data sedang di-fetch
- Data 100% live dari API (menggantikan data statis)
```

#### Files Created / Modified
```
- backend/src/controllers/stats.controller.js
- backend/src/routes/stats.routes.js
- backend/src/app.js (Mounted at /api/stats)
- frontend/src/app/admin/page.js (Full live stats integration)
```

#### Notes
```
Semua query statistik dijalankan secara paralel menggunakan Promise.all untuk performa optimal. Dashboard admin kini menampilkan data real-time dari database.
```

---

### ✅ STEP 21 — TESTING

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND + BACKEND
- **Status:** ✅ Selesai

#### Test Results
```
Login          : ✅ Passed (JWT token generation & auth errors)
Product        : ✅ Passed (Catalog list, slug, detail, & management)
Customer       : ✅ Passed (CRUD operations & validation)
Order          : ✅ Passed (Creation, totals, & status transitions)
Invoice        : ✅ Passed (Generation, unique INV number, & status)
Payment        : ✅ Passed (Partial & full payment, outstanding calculation)
Print Invoice  : ✅ Passed (A4 print layout & @media print styles)
```

---

### ✅ STEP 22 — SECURITY REVIEW

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND + BACKEND
- **Status:** ✅ Selesai

#### Security Checklist
```
Authentication      : ✅ Protected with JWT & Bearer authorization header
Authorization       : ✅ Endpoint mutations protected with verifyToken middleware
JWT                 : ✅ Verified using process.env.JWT_SECRET
Password Hash       : ✅ Encrypted with Bcrypt (salt round 10)
SQL Injection       : ✅ 100% Parameterized queries ($1, $2, ...) via pg pool
XSS & CORS          : ✅ Express CORS origin policy & React sanitization
Input Validation    : ✅ Verified on both frontend forms & backend controllers
Environment Vars    : ✅ DB Credentials & JWT Secret secured in .env
```

---

### ✅ STEP 23 — FINAL INTEGRATION

- **Tanggal:** 2026-09-11
- **Scope:** FRONTEND + BACKEND
- **Status:** ✅ Selesai

#### Final Flow Test Verified
```text
Public Website (Home/Products)
      │
      ▼
Product Detail / Order Form
      │
      ▼
REST API Backend (Node.js/Express)
      │
      ▼
PostgreSQL Database (sales_dashboard_db)
      │
      ▼
Admin Dashboard (/admin)
      │
      ▼
Order & Invoice Generation
      │
      ▼
Payment Processing & Outstanding Calculation
      │
      ▼
Printable A4 Invoice (PDF / Printer)
```

---

## ❗ KNOWN ISSUES & BLOCKERS

> Catat masalah yang belum terselesaikan di sini.

| # | STEP | Issue | Status |
|---|------|-------|--------|
| - | -    | -     | -      |

---

## 💡 CATATAN PENTING

> Catat hal-hal penting yang perlu diingat saat melanjutkan project.

```
-
```

---

## ▶️ CARA MELANJUTKAN PROJECT

1. Baca file ini untuk mengetahui progress terakhir
2. Lihat tabel **STEP OVERVIEW** — cari status 🔄 atau STEP terakhir yang ✅
3. Lanjutkan dengan perintah ke AI:

```
LANJUT STEP X
```

4. Setelah STEP selesai, update file ini:
   - Ubah status di tabel STEP OVERVIEW
   - Isi detail di section STEP yang bersangkutan
   - Update **Current Step** di PROJECT INFO
   - Update **Last Updated**

---

*File ini dikelola secara manual. Update setiap kali ada progress pengerjaan.*
