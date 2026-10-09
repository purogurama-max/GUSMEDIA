/**
 * Seed: 001_seed_categories_products.js
 * Description: Mengisi data awal categories dan products
 * Run: node migrations/seedData.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'sales_dashboard_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

const pool = new Pool(poolConfig);

const categories = [
  {
    name: 'ERP System',
    slug: 'erp-system',
    description: 'Enterprise Resource Planning System untuk manajemen bisnis terpadu',
  },
  {
    name: 'Point of Sale',
    slug: 'point-of-sale',
    description: 'Sistem kasir dan manajemen penjualan untuk toko dan restoran',
  },
  {
    name: 'HR & Payroll',
    slug: 'hr-payroll',
    description: 'Sistem manajemen SDM dan penggajian karyawan',
  },
  {
    name: 'Accounting',
    slug: 'accounting',
    description: 'Sistem akuntansi dan keuangan untuk perusahaan',
  },
  {
    name: 'Custom Software',
    slug: 'custom-software',
    description: 'Pengembangan software khusus sesuai kebutuhan bisnis',
  },
];

const products = [
  {
    name: 'GUSMEDIA ERP Enterprise',
    slug: 'gusmedia-erp-enterprise',
    description: 'Solusi ERP lengkap untuk perusahaan menengah dan besar. Integrasi penuh antara modul keuangan, inventori, HR, dan produksi dalam satu platform terpadu.',
    price: 150000000,
    category_slug: 'erp-system',
    status: 'ACTIVE',
  },
  {
    name: 'GUSMEDIA ERP Lite',
    slug: 'gusmedia-erp-lite',
    description: 'ERP versi ringan untuk UKM. Kelola keuangan, stok, dan pembelian dengan mudah tanpa kerumitan sistem enterprise.',
    price: 45000000,
    category_slug: 'erp-system',
    status: 'ACTIVE',
  },
  {
    name: 'CashierPro POS',
    slug: 'cashierpro-pos',
    description: 'Sistem kasir modern berbasis cloud. Mendukung multi-kasir, manajemen stok real-time, laporan penjualan harian, dan integrasi printer thermal.',
    price: 25000000,
    category_slug: 'point-of-sale',
    status: 'ACTIVE',
  },
  {
    name: 'CashierPro Restaurant',
    slug: 'cashierpro-restaurant',
    description: 'POS khusus restoran dengan manajemen meja, order ke dapur, split bill, dan laporan menu terlaris.',
    price: 30000000,
    category_slug: 'point-of-sale',
    status: 'ACTIVE',
  },
  {
    name: 'HRM Suite Pro',
    slug: 'hrm-suite-pro',
    description: 'Sistem HR lengkap: rekrutmen, absensi, penggajian, perhitungan lembur, slip gaji digital, dan laporan pajak PPh21 otomatis.',
    price: 55000000,
    category_slug: 'hr-payroll',
    status: 'ACTIVE',
  },
  {
    name: 'Payroll Express',
    slug: 'payroll-express',
    description: 'Modul penggajian sederhana namun powerful. Hitung gaji, BPJS, PPh21, dan cetak slip gaji dalam hitungan menit.',
    price: 18000000,
    category_slug: 'hr-payroll',
    status: 'ACTIVE',
  },
  {
    name: 'AccoBook Professional',
    slug: 'accobook-professional',
    description: 'Software akuntansi profesional dengan fitur double-entry, laporan keuangan lengkap (neraca, laba rugi, arus kas), dan rekonsiliasi bank otomatis.',
    price: 35000000,
    category_slug: 'accounting',
    status: 'ACTIVE',
  },
  {
    name: 'Custom Enterprise Solution',
    slug: 'custom-enterprise-solution',
    description: 'Pengembangan software enterprise sesuai kebutuhan spesifik bisnis Anda. Analisis kebutuhan, desain sistem, development, testing, dan support after-launch.',
    price: 200000000,
    category_slug: 'custom-software',
    status: 'ACTIVE',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting database seed...\n');
    await client.query('BEGIN');

    // Seed categories
    console.log('📂 Seeding categories...');
    for (const cat of categories) {
      const existing = await client.query('SELECT id FROM categories WHERE slug = $1', [cat.slug]);
      if (existing.rows.length === 0) {
        await client.query(
          'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)',
          [cat.name, cat.slug, cat.description]
        );
        console.log(`  ✅ Category created: ${cat.name}`);
      } else {
        console.log(`  ⏭️  Category already exists: ${cat.name}`);
      }
    }

    // Get category map
    const catResult = await client.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    catResult.rows.forEach((row) => {
      categoryMap[row.slug] = row.id;
    });

    // Seed products
    console.log('\n📦 Seeding products...');
    for (const prod of products) {
      const existing = await client.query('SELECT id FROM products WHERE slug = $1', [prod.slug]);
      if (existing.rows.length === 0) {
        const category_id = categoryMap[prod.category_slug] || null;
        await client.query(
          'INSERT INTO products (name, slug, description, price, category_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
          [prod.name, prod.slug, prod.description, prod.price, category_id, prod.status]
        );
        console.log(`  ✅ Product created: ${prod.name}`);
      } else {
        console.log(`  ⏭️  Product already exists: ${prod.name}`);
      }
    }

    // Seed company settings (jika belum ada)
    console.log('\n🏢 Seeding company settings...');
    const settingsExist = await client.query('SELECT id FROM company_settings LIMIT 1');
    if (settingsExist.rows.length === 0) {
      await client.query(`
        INSERT INTO company_settings (company_name, company_email, company_phone, company_address)
        VALUES ('GUSMEDIA', 'info@gusmedia.com', '+62 21 5558 9000', 'Jakarta Tech Hub, Level 14, Jl. Sudirman No.1, Jakarta 10220')
      `);
      console.log('  ✅ Company settings created');
    } else {
      console.log('  ⏭️  Company settings already exists');
    }

    // Seed admin user
    console.log('\n👤 Seeding admin user...');
    const adminExist = await client.query('SELECT id FROM users WHERE email = $1', ['admin@gusmedia.com']);
    if (adminExist.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('Admin12345!', 10);
      await client.query(
        'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)',
        ['Admin GUSMEDIA', 'admin@gusmedia.com', hash, 'ADMIN', true]
      );
      console.log('  ✅ Admin user created (email: admin@gusmedia.com)');
    } else {
      console.log('  ⏭️  Admin user already exists');
    }

    await client.query('COMMIT');
    console.log('\n✅ Seed completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
