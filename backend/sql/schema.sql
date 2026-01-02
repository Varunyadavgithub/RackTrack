-- Materials (already created)
CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sr_no INTEGER,
    sap_code TEXT UNIQUE,
    material_name TEXT,
    material_description TEXT,
    material_weight REAL,
    material_type TEXT
);

-- Racks
CREATE TABLE IF NOT EXISTS racks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rack_name TEXT NOT NULL,
    description TEXT
);

-- Shelves
CREATE TABLE IF NOT EXISTS shelves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rack_id INTEGER NOT NULL,
    shelf_name TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY(rack_id) REFERENCES racks(id)
);

-- Rack Items / Inventory
CREATE TABLE IF NOT EXISTS rack_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER NOT NULL,
    rack_id INTEGER NOT NULL,
    shelf_id INTEGER NOT NULL,
    quantity REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(material_id) REFERENCES materials(id),
    FOREIGN KEY(rack_id) REFERENCES racks(id),
    FOREIGN KEY(shelf_id) REFERENCES shelves(id)
);

-- Optional: Transaction History
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rack_item_id INTEGER NOT NULL,
    type TEXT NOT NULL,       -- "IN" or "OUT"
    quantity REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(rack_item_id) REFERENCES rack_items(id)
);
