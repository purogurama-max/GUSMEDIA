#!/usr/bin/env node
/**
 * STEP 21 — Manual API Test Script
 * Software Sales System — Backend API Test Coverage
 *
 * Menguji seluruh endpoint REST API secara berurutan.
 * Jalankan dengan: node tests/api.test.js
 * (Pastikan backend sudah berjalan di PORT 5000)
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

let passCount = 0;
let failCount = 0;
let testToken = null;
let createdCustomerId = null;
let createdOrderId = null;
let createdInvoiceId = null;
let createdPaymentId = null;

// ─── Helper ───────────────────────────────────────────────────────────────────
async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS  ${label}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL  ${label}${detail ? ' — ' + detail : ''}`);
    failCount++;
  }
}

// ─── Test Suites ──────────────────────────────────────────────────────────────

async function testHealth() {
  console.log('\n━━━ Health Check ━━━');
  const { status, json } = await request('GET', '/health');
  assert('GET /api/health → 200', status === 200);
  assert('Response success=true', json?.success === true);
}

async function testAuth() {
  console.log('\n━━━ Authentication ━━━');

  // Missing body → 422
  const bad = await request('POST', '/auth/login', { email: '', password: '' });
  assert('POST /auth/login (empty creds) → 400/422', bad.status === 400 || bad.status === 422);

  // Wrong credentials → 401/400
  const wrong = await request('POST', '/auth/login', { email: 'notfound@x.com', password: 'wrong' });
  assert('POST /auth/login (wrong creds) → 400/401', wrong.status === 400 || wrong.status === 401);

  // Valid admin credentials (seeded default)
  const good = await request('POST', '/auth/login', {
    email: 'admin@proximedia.com',
    password: 'Admin12345!',
  });
  assert('POST /auth/login (valid) → 200', good.status === 200);
  assert('Response contains token', !!good.json?.data?.token);
  if (good.json?.data?.token) testToken = good.json.data.token;
}

async function testStats() {
  console.log('\n━━━ Dashboard Statistics ━━━');
  const { status, json } = await request('GET', '/stats');
  assert('GET /api/stats → 200', status === 200);
  assert('Has total_revenue', typeof json?.data?.total_revenue === 'number');
  assert('Has total_orders', typeof json?.data?.total_orders === 'number');
  assert('Has total_customers', typeof json?.data?.total_customers === 'number');
  assert('Has total_products', typeof json?.data?.total_products === 'number');
  assert('Has pending_orders', typeof json?.data?.pending_orders === 'number');
  assert('Has completed_orders', typeof json?.data?.completed_orders === 'number');
  assert('Has total_outstanding', typeof json?.data?.total_outstanding === 'number');
}

async function testProducts() {
  console.log('\n━━━ Products ━━━');
  const list = await request('GET', '/products');
  assert('GET /api/products → 200', list.status === 200);
  assert('Returns array', Array.isArray(list.json?.data));

  const notFound = await request('GET', '/products/999999');
  assert('GET /api/products/999999 → 404', notFound.status === 404);
}

async function testCustomers() {
  console.log('\n━━━ Customers ━━━');

  // List
  const list = await request('GET', '/customers');
  assert('GET /api/customers → 200', list.status === 200);

  // Create — validation error
  const badCreate = await request('POST', '/customers', { name: '' });
  assert('POST /customers (missing name) → 422', badCreate.status === 422);

  // Create — valid
  const created = await request('POST', '/customers', {
    name: 'Test Customer STEP21',
    email: `test.step21.${Date.now()}@example.com`,
    phone: '081234567890',
    company: 'QA Corp',
    address: 'Jl. Testing No. 21',
  });
  assert('POST /api/customers (valid) → 201', created.status === 201);
  assert('Returns customer id', !!created.json?.data?.id);
  if (created.json?.data?.id) createdCustomerId = created.json.data.id;

  // Get by ID
  if (createdCustomerId) {
    const detail = await request('GET', `/customers/${createdCustomerId}`);
    assert('GET /api/customers/:id → 200', detail.status === 200);
  }

  // Not found
  const nf = await request('GET', '/customers/999999');
  assert('GET /api/customers/999999 → 404', nf.status === 404);
}

async function testOrders() {
  console.log('\n━━━ Orders ━━━');

  // List
  const list = await request('GET', '/orders');
  assert('GET /api/orders → 200', list.status === 200);

  // Create — validation error (no items)
  const badCreate = await request('POST', '/orders', { customer_id: createdCustomerId });
  assert('POST /orders (missing items) → 422', badCreate.status === 422);

  // Fetch a real product id for the test order
  const prodList = await request('GET', '/products?limit=1');
  const testProductId = prodList.json?.data?.[0]?.id;

  if (createdCustomerId && testProductId) {
    const created = await request('POST', '/orders', {
      customer_id: createdCustomerId,
      items: [{ product_id: testProductId, quantity: 1 }],
      discount: 0,
      tax: 0,
      notes: 'STEP21 Test Order',
    });
    assert('POST /api/orders (valid) → 201', created.status === 201);
    assert('Returns order_number', !!created.json?.data?.order_number);
    if (created.json?.data?.id) createdOrderId = created.json.data.id;
  } else {
    console.log('  ⚠️  SKIP  POST /orders — no product or customer available');
  }

  // Update Status — invalid status
  if (createdOrderId) {
    const badStatus = await request('PUT', `/orders/${createdOrderId}/status`, { status: 'FLYING' });
    assert('PUT /orders/:id/status (invalid) → 422', badStatus.status === 422);

    const goodStatus = await request('PUT', `/orders/${createdOrderId}/status`, { status: 'CONFIRMED' });
    assert('PUT /orders/:id/status (valid) → 200', goodStatus.status === 200);
  }

  // Not found
  const nf = await request('GET', '/orders/999999');
  assert('GET /api/orders/999999 → 404', nf.status === 404);
}

async function testInvoices() {
  console.log('\n━━━ Invoices ━━━');

  const list = await request('GET', '/invoices');
  assert('GET /api/invoices → 200', list.status === 200);

  // Create — missing order_id
  const bad = await request('POST', '/invoices', {});
  assert('POST /invoices (no order_id) → 422', bad.status === 422);

  // Create valid invoice from test order
  if (createdOrderId) {
    const created = await request('POST', '/invoices', {
      order_id: createdOrderId,
      due_days: 30,
      notes: 'STEP21 Test Invoice',
    });
    assert('POST /api/invoices (valid) → 201', created.status === 201);
    assert('invoice_number format INV-', created.json?.data?.invoice_number?.startsWith('INV-'));
    if (created.json?.data?.id) createdInvoiceId = created.json.data.id;

    // Duplicate invoice → 400
    const dup = await request('POST', '/invoices', { order_id: createdOrderId });
    assert('POST /invoices (duplicate) → 400', dup.status === 400);
  }

  // Update status
  if (createdInvoiceId) {
    const badStatus = await request('PUT', `/invoices/${createdInvoiceId}/status`, { payment_status: 'FLYING' });
    assert('PUT /invoices/:id/status (invalid) → 422', badStatus.status === 422);

    const goodStatus = await request('PUT', `/invoices/${createdInvoiceId}/status`, { payment_status: 'PARTIAL' });
    assert('PUT /invoices/:id/status (valid) → 200', goodStatus.status === 200);
  }

  // Not found
  const nf = await request('GET', '/invoices/999999');
  assert('GET /api/invoices/999999 → 404', nf.status === 404);
}

async function testPayments() {
  console.log('\n━━━ Payments ━━━');

  const list = await request('GET', '/payments');
  assert('GET /api/payments → 200', list.status === 200);

  const outstanding = await request('GET', '/payments/outstanding');
  assert('GET /api/payments/outstanding → 200', outstanding.status === 200);
  assert('Outstanding returns array', Array.isArray(outstanding.json?.data));

  // Validation errors
  const bad = await request('POST', '/payments', { invoice_id: createdInvoiceId });
  assert('POST /payments (missing amount) → 422', bad.status === 422);

  const badMethod = await request('POST', '/payments', {
    invoice_id: createdInvoiceId, amount: 100000, payment_method: 'BITCOIN',
  });
  assert('POST /payments (invalid method) → 400', badMethod.status === 400);

  // Valid payment
  if (createdInvoiceId) {
    const created = await request('POST', '/payments', {
      invoice_id: createdInvoiceId,
      amount: 100000,
      payment_method: 'TRANSFER',
      notes: 'STEP21 test partial payment',
    });
    assert('POST /api/payments (valid) → 201', created.status === 201);
    assert('Returns payment id', !!created.json?.data?.id);
    if (created.json?.data?.id) createdPaymentId = created.json.data.id;

    // Payment history
    const history = await request('GET', `/payments/history/${createdInvoiceId}`);
    assert('GET /payments/history/:invoiceId → 200', history.status === 200);
    assert('History contains payments array', Array.isArray(history.json?.data?.payments));
  }

  // Not found history
  const nfHistory = await request('GET', '/payments/history/999999');
  assert('GET /payments/history/999999 → 404', nfHistory.status === 404);
}

// ─── Main Runner ──────────────────────────────────────────────────────────────
async function runAll() {
  console.log('========================================');
  console.log('  STEP 21 — API Test Suite');
  console.log('  Software Sales System Backend');
  console.log(`  Target: ${BASE_URL}`);
  console.log('========================================');

  try {
    await testHealth();
    await testAuth();
    await testStats();
    await testProducts();
    await testCustomers();
    await testOrders();
    await testInvoices();
    await testPayments();
  } catch (err) {
    console.error('\n💥 Unexpected Error:', err.message);
    failCount++;
  }

  console.log('\n========================================');
  console.log(`  Results: ${passCount + failCount} tests`);
  console.log(`  ✅ Passed : ${passCount}`);
  console.log(`  ❌ Failed : ${failCount}`);
  console.log('========================================\n');

  process.exit(failCount > 0 ? 1 : 0);
}

runAll();
