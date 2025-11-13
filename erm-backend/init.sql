-- ==========================================
-- 1. BERSIHKAN TABEL LAMA (Opsional/Reset)
-- ==========================================
DROP TABLE IF EXISTS risk_items;
DROP TABLE IF EXISTS compliance_items;
DROP TABLE IF EXISTS zis_tracking_stats;
DROP TABLE IF EXISTS risk_dashboard_stats;

-- ==========================================
-- 2. STRUKTUR TABEL (SCHEMA)
-- ==========================================

-- Tabel 1: Manajemen Risiko (Risk Items)
-- Digunakan oleh: RiskManagement.tsx, RiskMatrix.tsx, RiskTable.tsx
CREATE TABLE risk_items (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Operational, Financial, Sharia, Reputation
    impact VARCHAR(50) NOT NULL,   -- Critical, High, Medium, Low
    likelihood VARCHAR(50) NOT NULL, -- High, Medium, Low
    status VARCHAR(50) NOT NULL,   -- Open, Mitigated, Closed, Monitoring
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabel 2: Kepatuhan Syariah (Compliance Items)
-- Digunakan oleh: ShariaCompliance.tsx, ComplianceChecklist.tsx
CREATE TABLE compliance_items (
    id VARCHAR(255) PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- Tabel 3: Statistik Publik ZIS (ZIS Tracking)
-- Digunakan oleh: ZisTracking.tsx (Halaman Depan/Publik)
CREATE TABLE zis_tracking_stats (
    id SERIAL PRIMARY KEY,
    total_collected NUMERIC(15, 2),
    total_distributed NUMERIC(15, 2),
    muzakki_count INTEGER,
    mustahik_count INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 4: Statistik Dashboard Internal (KPI Cards)
-- Digunakan oleh: Dashboard.tsx (Untuk menampilkan nilai RHA & ACR)
CREATE TABLE risk_dashboard_stats (
    id SERIAL PRIMARY KEY,
    total_risks INTEGER,
    high_risks INTEGER,
    rha_score NUMERIC(5, 2), -- Risk Handling Accuracy (%)
    acr_score NUMERIC(5, 2), -- Average Compliance Rate (%)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. SEEDING DATA DUMMY (PREDIKSI KONTEKS ZISWAF)
-- ==========================================

-- A. Data Dummy Risiko (Konteks: Lembaga Zakat)
INSERT INTO risk_items (id, description, category, impact, likelihood, status) VALUES
('OP-001', 'Server database donatur down saat puncak Ramadhan', 'Operational', 'Critical', 'Medium', 'Open'),
('FN-001', 'Selisih pencatatan manual vs sistem bank', 'Financial', 'High', 'Low', 'Mitigated'),
('SY-001', 'Penyaluran zakat mal kepada asnaf yang meragukan', 'Sharia', 'Critical', 'Low', 'Monitoring'),
('RP-001', 'Isu negatif di media sosial terkait transparansi dana', 'Reputation', 'High', 'Medium', 'Open'),
('OP-002', 'Keterlambatan laporan bulanan cabang daerah', 'Operational', 'Medium', 'High', 'Closed'),
('SY-002', 'Akad wakaf tunai belum sesuai fatwa terbaru', 'Sharia', 'High', 'Low', 'Open');

-- B. Data Dummy Checklist Syariah
INSERT INTO compliance_items (id, text, completed) VALUES
('sc-01', 'Pemisahan rekening dana Zakat, Infak, dan Amil', TRUE),
('sc-02', 'Audit Syariah internal semester I terlaksana', TRUE),
('sc-03', 'Verifikasi syar’i proposal investasi dana wakaf', FALSE),
('sc-04', 'SOP Penyaluran sesuai 8 Asnaf', TRUE),
('sc-05', 'Laporan publikasi diaudit KAP Syariah', FALSE);

-- C. Data Dummy Statistik ZIS (Angka Besar)
-- Pastikan hanya ada 1 baris data agar frontend tidak bingung
INSERT INTO zis_tracking_stats (total_collected, total_distributed, muzakki_count, mustahik_count) VALUES
(1500000000.00, 980000000.00, 12500, 4500);

-- D. Data Dummy KPI Dashboard (RHA & ACR)
-- Pastikan hanya ada 1 baris data
INSERT INTO risk_dashboard_stats (total_risks, high_risks, rha_score, acr_score) VALUES
(25, 4, 88.5, 92.0);