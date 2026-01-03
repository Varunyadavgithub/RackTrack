# 🏭 RackTrack API Documentation

RackTrack provides RESTful APIs to manage **racks, shelves, materials, and inventory transactions** in a manufacturing or warehouse setting.

**Base URL (Example):**

```
http://10.100.95.54:5000/api/v1
```

---

## 📦 Racks API

### 1. Get All Racks

```
GET /racks
```

**Description:** Fetch all racks in the system.
**Response:**

```json
[
  {
    "id": "1",
    "rack_name": "RACK-01",
    "location": "Freezer Line",
    "capacity_kg": 1000
  },
  ...
]
```

---

### 2. Get Shelves of a Rack

```
GET /racks/:rackName/shelves
```

**Description:** Fetch all shelves for a specific rack.
**Params:**

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| rackName  | string | Name of the rack |

**Response:**

```json
[
  "Shelf-01",
  "Shelf-02",
  "Shelf-03"
]
```

---

## 📦 Materials API

### 1. Get Material by SAP Code

```
GET /materials/:sapCode
```

**Description:** Fetch material information using SAP code.
**Params:**

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| sapCode   | string | SAP code of item |

**Response:**

```json
{
  "id": "1",
  "material_name": "Steel Rod",
  "sap_code": "SAP123",
  "material_description": "High-grade steel",
  "material_weight": 10,
  "quantity": 50,
  "rack_name": "RACK-01",
  "shelf_name": "Shelf-01"
}
```

---

## 📦 Rack Items API

### 1. Search Rack Items

```
GET /rack-items/search
```

**Description:** Search items by SAP code or by rack & shelf.
**Query Parameters:**

| Parameter   | Type   | Optional | Description       |
| ----------- | ------ | -------- | ----------------- |
| sapCode     | string | Yes      | Material SAP code |
| rackNumber  | string | Yes      | Rack number       |
| shelfNumber | string | Yes      | Shelf number      |

**Response:**

```json
[
  {
    "id": "1",
    "material_name": "Steel Rod",
    "sap_code": "SAP123",
    "material_weight": 10,
    "quantity": 50,
    "material_description": "High-grade steel",
    "rack_name": "RACK-01",
    "shelf_name": "Shelf-01"
  }
]
```

---

### 2. Add Rack Item

```
POST /rack-items
```

**Description:** Add a new material to a rack and shelf.
**Request Body:**

```json
{
  "rackNumber": "RACK-01",
  "shelfNumber": "Shelf-01",
  "sapCode": "SAP123",
  "material_name": "Steel Rod",
  "material_weight": 10,
  "quantity": 50,
  "material_description": "High-grade steel"
}
```

**Response:**

```json
{
  "message": "Material added successfully",
  "rackItem": {
    "id": "1",
    "rackNumber": "RACK-01",
    "shelfNumber": "Shelf-01",
    "sapCode": "SAP123",
    "quantity": 50
  }
}
```

---

### 3. Update Rack Item

```
PUT /rack-items/:id
```

**Description:** Update quantity or details of an existing material.
**Params:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| id        | string | Rack item ID |

**Request Body:**

```json
{
  "quantity": 60,
  "material_description": "Updated description"
}
```

**Response:**

```json
{
  "message": "Rack item updated successfully",
  "rackItem": {
    "id": "1",
    "quantity": 60,
    "material_description": "Updated description"
  }
}
```

---

### 4. Delete Rack Item

```
DELETE /rack-items
```

**Description:** Remove material from a rack.
**Request Body:**

```json
{
  "rackNumber": "RACK-01",
  "shelfNumber": "Shelf-01",
  "sapCode": "SAP123",
  "quantity": 20
}
```

**Response:**

```json
{
  "message": "Material removed successfully"
}
```

---

## 📦 Inventory Transactions API

### 1. Get All Transactions

```
GET /inventory-transactions
```

**Description:** Fetch all inventory transactions (IN/OUT).
**Response:**

```json
[
  {
    "id": "1",
    "sapCode": "SAP123",
    "rackNumber": "RACK-01",
    "shelfNumber": "Shelf-01",
    "quantity": 50,
    "transactionType": "IN",
    "timestamp": "2026-01-03T10:00:00Z"
  }
]
```

---

### 2. Add New Transaction

```
POST /inventory-transactions
```

**Description:** Record a new inventory movement (IN/OUT).
**Request Body:**

```json
{
  "sapCode": "SAP123",
  "rackNumber": "RACK-01",
  "shelfNumber": "Shelf-01",
  "quantity": 50,
  "transactionType": "IN"
}
```

**Response:**

```json
{
  "message": "Inventory transaction recorded",
  "transaction": {
    "id": "1",
    "sapCode": "SAP123",
    "rackNumber": "RACK-01",
    "shelfNumber": "Shelf-01",
    "quantity": 50,
    "transactionType": "IN",
    "timestamp": "2026-01-03T10:00:00Z"
  }
}
```

---

## ⚡ Notes

* All **POST/PUT/DELETE** endpoints require **JSON body** and appropriate fields.
* All **GET** endpoints return JSON arrays or objects.
* Quantity is always an **integer**; material_weight is in **kg**.
* SAP code is the **primary identifier** for materials.
* Transactions are logged automatically for audit purposes.

---

✅ This API documentation now fully covers:

* Rack management
* Shelf lookup
* Material CRUD
* Rack load calculation (via quantities & weight)
* Inventory transactions