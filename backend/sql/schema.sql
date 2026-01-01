-- =========================================
-- Rack Management Database Schema
-- Compatible with PostgreSQL / Neon
-- =========================================

-- =========================================
-- Table: racks
-- =========================================
CREATE TABLE IF NOT EXISTS racks (
    id SERIAL PRIMARY KEY,
    sr_no SERIAL NOT NULL, -- auto-increment serial number
    rack_number VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    area VARCHAR(50),
    capacity INT,
    no_of_shelves INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- Table: shelves
-- =========================================
CREATE TABLE IF NOT EXISTS shelves (
    id SERIAL PRIMARY KEY,
    sr_no SERIAL NOT NULL, -- auto-increment serial number
    shelf_number VARCHAR(50) NOT NULL,
    rack_id INT NOT NULL REFERENCES racks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- Table: materials
-- =========================================
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    sr_no SERIAL NOT NULL, -- auto-increment serial number
    sap_code VARCHAR(50) NOT NULL,
    name VARCHAR(50),
    description TEXT,
    weight DECIMAL(10,2),
    type VARCHAR(50),
    pallet_weight DECIMAL(10,2),
    shelf_id INT NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- Optional: Indexes for faster queries
-- =========================================
CREATE INDEX IF NOT EXISTS idx_shelves_rack_id ON shelves(rack_id);
CREATE INDEX IF NOT EXISTS idx_materials_shelf_id ON materials(shelf_id);

-- =========================================
-- End of SQL File
-- =========================================