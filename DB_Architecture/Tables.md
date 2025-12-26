## Database Tables

This database is designed to manage warehouse storage by organizing **items** within **shelves**, which belong to **racks**. The structure ensures traceability, capacity planning, and efficient inventory management.

---

## Rack

The **Rack** table stores information about storage racks in the warehouse.

### Fields

* **id**: Unique identifier for the rack
* **rackNumber**: Human-readable rack code
* **location**: Physical location of the rack (e.g., production line or section)
* **area**: Operational area where the rack is used
* **capacity**: Maximum storage capacity of the rack

### Example

```json
{
    "_id": "rackId",
    "rackNumber": "R01",
    "location": "Freezer Line",
    "area": "Part Process",
    "capacity": "5000 KG"
}
```

---

## Shelf

The **Shelf** table represents individual shelves inside a rack.

### Fields

* **id**: Unique identifier for the shelf
* **shelfNumber**: Shelf code within the rack
* **rackId**: Reference to the rack this shelf belongs to

### Example

```json
{
    "_id": "shelfId",
    "shelfNumber": "S03",
    "rackId": "rackId"
}
```

---

## Item

The **Item** table stores inventory item details and tracks where each item is stored.

### Fields

* **id**: Unique identifier for the item
* **sapCode**: SAP or ERP item code
* **itemName**: Name of the item
* **description**: Brief description of the item
* **quantity**: Available quantity
* **rackId**: Reference to the rack where the item is stored
* **shelfId**: Reference to the shelf where the item is stored
* **lastUpdated**: Timestamp of the last inventory update

### Example

```json
{
    "_id": "itemId",
    "sapCode": "SAP12345",
    "itemName": "Frozen Chicken Parts",
    "description": "Processed frozen chicken parts",
    "quantity": 1200,
    "rackId": "rackId",
    "shelfId": "shelfId",
    "lastUpdated": "2025-01-15T10:30:00Z"
}
```

---

### Relationships Summary

* One **Rack** ➝ many **Shelves**
* One **Shelf** ➝ many **Items**
* Each **Item** is uniquely located using `rackId` and `shelfId`
