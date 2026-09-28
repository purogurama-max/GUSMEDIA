export const mockProducts = [
  {
    id: 1,
    name: "OmniERP Suite",
    slug: "omnierp-suite",
    category: "Enterprise Software",
    price: 15000000,
    formattedPrice: "Rp 15.000.000",
    image: "/images/products/omnierp.png",
    status: "ACTIVE",
    shortDescription: "Complete enterprise resource planning software for finance, HR, inventory, and procurement.",
    description: "OmniERP Suite is an all-in-one software solution engineered for scalable enterprise management. It integrates seamlessly across financial ledgering, automated inventory synchronization, payroll management, and real-time operational analytics.",
    features: [
      "Multi-currency financial ledger & automated journal entry",
      "Real-time inventory tracking with multi-warehouse support",
      "HR & Payroll processing with automated tax calculations",
      "Customizable role-based access control (RBAC)",
      "RESTful API integrations for third-party tools"
    ],
    specifications: {
      deployment: "Cloud SaaS or On-Premise",
      database: "PostgreSQL / Enterprise SQL",
      users: "Unlimited User Tier Available",
      support: "24/7 SLA Support with Dedicated Engineer"
    }
  },
  {
    id: 2,
    name: "CloudFlow CRM",
    slug: "cloudflow-crm",
    category: "Sales & Marketing",
    price: 8500000,
    formattedPrice: "Rp 8.500.000",
    image: "/images/products/cloudflow.png",
    status: "ACTIVE",
    shortDescription: "Customer relationship management software with automated sales pipeline and AI lead scoring.",
    description: "CloudFlow CRM enables sales teams to close deals faster by tracking client touchpoints, managing lead pipelines, and generating predictive revenue analytics in a single unified dashboard.",
    features: [
      "Visual drag-and-drop deal pipeline management",
      "Automated email outreach & lead follow-up reminders",
      "Customer contact history and interaction tracking",
      "Comprehensive sales forecasting and team performance reports"
    ],
    specifications: {
      deployment: "Cloud SaaS",
      integrations: "WhatsApp API, Email, Webhooks",
      storage: "50 GB Cloud Storage included",
      support: "Business Hours Technical Support"
    }
  },
  {
    id: 3,
    name: "SecureGate Auth",
    slug: "securegate-auth",
    category: "Security & Infrastructure",
    price: 5000000,
    formattedPrice: "Rp 5.000.000",
    image: "/images/products/securegate.png",
    status: "ACTIVE",
    shortDescription: "Identity & access management platform supporting JWT, OAuth2, and multi-factor authentication.",
    description: "SecureGate Auth provides high-performance identity management for microservices and web applications. Protect your digital infrastructure with zero-trust access policies.",
    features: [
      "JWT access token & refresh token rotation service",
      "OAuth2 and Social SSO (Google, GitHub, Microsoft)",
      "Time-based One-Time Password (TOTP) 2FA support",
      "Comprehensive audit logs and anomaly detection"
    ],
    specifications: {
      deployment: "Docker / Kubernetes / Node.js Microservice",
      throughput: "Up to 50,000 auth requests/sec",
      compliance: "SOC2 & GDPR Ready",
      support: "Priority Security Response Team"
    }
  },
  {
    id: 4,
    name: "DataSync ETL Engine",
    slug: "datasync-etl-engine",
    category: "Database & Data Engineering",
    price: 12000000,
    formattedPrice: "Rp 12.000.000",
    image: "/images/products/datasync.png",
    status: "ACTIVE",
    shortDescription: "High-speed data pipeline tool for database migration, CDC, and automated backup schedules.",
    description: "DataSync ETL Engine simplifies real-time data replication between heterogeneous databases with minimum latency and high fault tolerance.",
    features: [
      "Real-time Change Data Capture (CDC)",
      "Automated PostgreSQL backup and point-in-time recovery",
      "Visual pipeline builder with data transformation nodes",
      "Encrypted data transfer over TLS 1.3"
    ],
    specifications: {
      deployment: "On-Premise / Cloud Container",
      databases: "PostgreSQL, MySQL, SQL Server, Oracle",
      support: "24/7 SLAs Available"
    }
  }
];
