-- Flyway V1: Initial Core Schema for ApniBilling Multi-Tenant System

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,
    trade_name VARCHAR(150),
    gstin VARCHAR(15),
    pan VARCHAR(10),
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    state_code VARCHAR(2) NOT NULL,
    state_name VARCHAR(60),
    currency VARCHAR(3) DEFAULT 'INR',
    upi_id VARCHAR(100),
    invoice_prefix VARCHAR(20) DEFAULT 'INV/26-27/',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'OWNER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS parties (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    gstin VARCHAR(15),
    party_type VARCHAR(10) NOT NULL DEFAULT 'B2C',
    state_code VARCHAR(2),
    address TEXT,
    balance NUMERIC(14,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(60),
    barcode VARCHAR(60),
    category VARCHAR(60),
    unit VARCHAR(20) DEFAULT 'PCS',
    purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    hsn_sac VARCHAR(10) NOT NULL,
    current_stock NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    low_stock_alert NUMERIC(12,3) DEFAULT 5.000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
    customer_id UUID REFERENCES parties(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20),
    customer_gstin VARCHAR(15),
    is_inter_state BOOLEAN NOT NULL DEFAULT FALSE,
    subtotal NUMERIC(14,2) NOT NULL,
    order_discount NUMERIC(14,2) DEFAULT 0.00,
    taxable_amount NUMERIC(14,2) NOT NULL,
    cgst NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    igst NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    round_off NUMERIC(6,2) DEFAULT 0.00,
    grand_total NUMERIC(14,2) NOT NULL,
    paid_amount NUMERIC(14,2) NOT NULL,
    balance_amount NUMERIC(14,2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL DEFAULT 'CASH',
    status VARCHAR(20) NOT NULL DEFAULT 'PAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_invoice_num UNIQUE (tenant_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    name VARCHAR(200) NOT NULL,
    hsn_sac VARCHAR(10) NOT NULL,
    unit VARCHAR(20),
    quantity NUMERIC(12,3) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    taxable_value NUMERIC(14,2) NOT NULL,
    gst_rate NUMERIC(5,2) NOT NULL,
    cgst NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(14,2) NOT NULL
);
