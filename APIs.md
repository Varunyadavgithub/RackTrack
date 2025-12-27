# **RackTrack API Documentation**

**Base URL:**

```
http://localhost:5000/api
```

---

## **1️⃣ Add Item**

**Endpoint:**

```
POST /items
```

**Description:**
Add a new item to a specific rack and shelf. If the rack or shelf does not exist, it will be auto-created. If the item already exists in the same rack and shelf, its quantity will be incremented.

**Request Body (JSON):**

```json
{
  "rackNumber": "RACK-01",
  "shelfNumber": "S1",
  "sapCode": "SAP99999",
  "itemName": "Test Item",
  "description": "Test description",
  "quantity": 50
}
```

**Success Response (201):**

```json
{
  "id": "uuid-of-item",
  "sap_code": "SAP99999",
  "item_name": "Test Item",
  "description": "Test description",
  "quantity": 50,
  "rack_id": "uuid-of-rack",
  "shelf_id": "uuid-of-shelf",
  "last_updated": "2025-12-27T12:00:00.000Z"
}
```

**Errors:**

- `500`: Server error with error message

---

## **2️⃣ Search Item**

**Endpoint:**

```
GET /items/search
```

**Description:**
Search items by SAP code or by rack + shelf. You can provide any combination of query parameters.

**Query Parameters:**

- `sap` (optional) – SAP code of the item
- `rack` (optional) – Rack number
- `shelf` (optional) – Shelf number

**Examples:**

```
GET /items/search?sap=SAP99999
GET /items/search?rack=RACK-01&shelf=S1
```

**Success Response (200):**

- **Single item:**

```json
{
  "id": "uuid-of-item",
  "sap_code": "SAP99999",
  "item_name": "Test Item",
  "description": "Test description",
  "quantity": 50,
  "rack_id": "uuid-of-rack",
  "shelf_id": "uuid-of-shelf",
  "last_updated": "2025-12-27T12:00:00.000Z"
}
```

- **Multiple items (array):**

```json
[
  {
    "id": "uuid1",
    "sap_code": "SAP12345",
    "item_name": "Compressor",
    "quantity": 1200,
    "rack_id": "uuid-rack",
    "shelf_id": "uuid-shelf",
    "last_updated": "2025-12-26T12:30:00Z"
  },
  {
    "id": "uuid2",
    "sap_code": "SAP12346",
    "item_name": "Condenser Coil",
    "quantity": 850,
    "rack_id": "uuid-rack",
    "shelf_id": "uuid-shelf",
    "last_updated": "2025-12-25T09:15:00Z"
  }
]
```

**Error Response (404):**

```json
{
  "message": "Item not found"
}
```

---

## **3️⃣ Update Item Quantity**

**Endpoint:**

```
PUT /items/:id
```

**Description:**
Update the quantity of a specific item.

**Path Parameter:**

- `id` – Item ID (UUID)

**Request Body (JSON):**

```json
{
  "quantity": 200
}
```

**Success Response (200):**

```json
{
  "id": "uuid-of-item",
  "sap_code": "SAP99999",
  "item_name": "Test Item",
  "description": "Test description",
  "quantity": 200,
  "rack_id": "uuid-of-rack",
  "shelf_id": "uuid-of-shelf",
  "last_updated": "2025-12-27T12:10:00.000Z"
}
```

**Errors:**

- `404`: Item not found
- `500`: Server error

---

## **4️⃣ Remove Item**

**Endpoint:**

```
DELETE /items/remove
```

**Description:**
Remove an item by rack number, shelf number, SAP code, and quantity.

**Request Body (JSON):**

```json
{
  "rack": "RACK-01",
  "shelf": "S1",
  "sap": "SAP99999",
  "quantity": 50
}
```

**Success Response (200):**

```json
{
  "message": "Item removed successfully",
  "removedItem": {
    "id": "uuid-of-item",
    "sap_code": "SAP99999",
    "item_name": "Test Item",
    "quantity": 50,
    "rack_id": "uuid-of-rack",
    "shelf_id": "uuid-of-shelf",
    "last_updated": "2025-12-27T12:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "message": "Item not found or already removed"
}
```

**Error Response (400):**

```json
{
  "message": "rack, shelf, sap, and quantity are required"
}
```

---

## **5️⃣ Rack Overview**

**Endpoint:**

```
GET /racks
```

**Description:**
Get a complete overview of racks → shelves → items, formatted for the frontend.

**Success Response (200):**

```json
[
  {
    "_id": "uuid-rack",
    "rackNumber": "RACK-01",
    "location": "Frz. Line",
    "area": "Part Process",
    "capacity": "5000 kg",
    "shelves": [
      {
        "_id": "uuid-shelf",
        "rackId": "uuid-rack",
        "shelfNumber": "S1",
        "items": [
          {
            "_id": "uuid-item",
            "sapCode": "SAP12345",
            "itemName": "Compressor",
            "description": "High-pressure refrigeration compressor",
            "quantity": 1200,
            "rackId": "uuid-rack",
            "shelfId": "uuid-shelf",
            "lastUpdated": "2025-12-26T12:30:00Z"
          }
        ]
      }
    ]
  }
]
```

---

### **Notes & Tips**

- Use **UUIDs** for `:id` parameters in `PUT` and `DELETE`.
- All `last_updated` timestamps are in **ISO format**.
- `Add Item` auto-creates racks and shelves if missing.
- `Remove Item` requires **exact quantity match** for deletion.
