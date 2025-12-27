-- =========================
-- RACKS TABLE
-- =========================
CREATE TABLE racks (
    rack_id VARCHAR(10) PRIMARY KEY,
    rack_number VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    area VARCHAR(100),
    capacity_kg INTEGER CHECK (capacity_kg >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SHELVES TABLE
-- =========================
CREATE TABLE shelves (
    shelf_id VARCHAR(10) PRIMARY KEY,
    rack_id VARCHAR(10) NOT NULL,
    shelf_number VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_shelf_rack
        FOREIGN KEY (rack_id)
        REFERENCES racks (rack_id)
        ON DELETE CASCADE
);

-- =========================
-- ITEMS TABLE
-- =========================
CREATE TABLE items (
    item_id VARCHAR(10) PRIMARY KEY,
    sap_code VARCHAR(30) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    rack_id VARCHAR(10) NOT NULL,
    shelf_id VARCHAR(10) NOT NULL,
    last_updated TIMESTAMP NOT NULL,

    CONSTRAINT fk_item_rack
        FOREIGN KEY (rack_id)
        REFERENCES racks (rack_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_item_shelf
        FOREIGN KEY (shelf_id)
        REFERENCES shelves (shelf_id)
        ON DELETE CASCADE
);

-- =========================
-- INDEXES (Performance)
-- =========================
CREATE INDEX idx_shelves_rack_id ON shelves (rack_id);
CREATE INDEX idx_items_rack_id ON items (rack_id);
CREATE INDEX idx_items_shelf_id ON items (shelf_id);
CREATE INDEX idx_items_sap_code ON items (sap_code);
