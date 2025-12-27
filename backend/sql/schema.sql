CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Racks
CREATE TABLE racks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rack_number VARCHAR(50) UNIQUE NOT NULL,
  location TEXT,
  area TEXT,
  capacity TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shelves
CREATE TABLE shelves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shelf_number VARCHAR(50) NOT NULL,
  rack_id UUID REFERENCES racks(id) ON DELETE CASCADE
);

-- Items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sap_code VARCHAR(100) NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INT NOT NULL,
  rack_id UUID REFERENCES racks(id),
  shelf_id UUID REFERENCES shelves(id),
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE (sap_code, rack_id, shelf_id)
);