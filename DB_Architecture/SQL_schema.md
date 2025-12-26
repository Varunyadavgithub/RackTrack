Below is a clean **SQL schema** based on your README, using standard relational design and foreign keys.

```sql
-- =========================
-- Rack Table
-- =========================
CREATE TABLE racks (
    id VARCHAR(36) PRIMARY KEY,
    rack_number VARCHAR(20) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    capacity VARCHAR(50) NOT NULL
);

-- =========================
-- Shelf Table
-- =========================
CREATE TABLE shelves (
    id VARCHAR(36) PRIMARY KEY,
    shelf_number VARCHAR(20) NOT NULL,
    rack_id VARCHAR(36) NOT NULL,
    CONSTRAINT fk_shelf_rack
        FOREIGN KEY (rack_id)
        REFERENCES racks(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_shelf_per_rack
        UNIQUE (shelf_number, rack_id)
);

-- =========================
-- Item Table
-- =========================
CREATE TABLE items (
    id VARCHAR(36) PRIMARY KEY,
    sap_code VARCHAR(50) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    quantity INT NOT NULL CHECK (quantity >= 0),
    rack_id VARCHAR(36) NOT NULL,
    shelf_id VARCHAR(36) NOT NULL,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_rack
        FOREIGN KEY (rack_id)
        REFERENCES racks(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_item_shelf
        FOREIGN KEY (shelf_id)
        REFERENCES shelves(id)
        ON DELETE RESTRICT
);
```

### Notes & Best Practices

* `VARCHAR(36)` is used for IDs to support UUIDs.
* `ON DELETE CASCADE` on **shelves → racks** ensures shelves are removed if a rack is deleted.
* `ON DELETE RESTRICT` on **items** prevents accidental deletion of racks/shelves that still contain items.
* `CHECK (quantity >= 0)` ensures inventory integrity.
* `last_updated` auto-updates on insert (you can add triggers if you want auto-update on change).