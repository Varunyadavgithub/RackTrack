# 🏭 RackTrack

### Smart Rack & Inventory Management System for Manufacturing Units

RackTrack is a **cross-platform mobile application** designed to digitally manage **rack-based inventory systems** in large manufacturing and refrigeration plants. The application helps organizations track **racks, shelves, SAP items, quantities, and load distribution** in a structured and reliable way.

This project was built with a strong focus on **operational efficiency, data accuracy, and workplace safety**.

---

## 🚀 Problem Background

In large-scale manufacturing companies like **Western Refrigeration Pvt. Ltd.**, inventory is stored in:

* Very **tall industrial racks**
* Multiple **shelves per rack**
* Items identified by **SAP codes**

The absence of a centralized digital system led to operational inefficiencies and safety concerns.

---

## 🚧 Challenges

Before RackTrack, the inventory and rack management process faced several critical challenges:

* **Manual registers and Excel sheets**
  Inventory was tracked manually, leading to human errors, outdated data, and inconsistent records.

* **Time-consuming item lookup**
  Finding an item required physically searching racks or checking multiple documents, slowing down production and maintenance work.

* **Frequent quantity mismatches**
  Lack of real-time updates caused discrepancies between actual stock and recorded quantities.

* **No real-time visibility of rack load**
  There was no digital visibility into how much material was stored on each rack or shelf.

* **Serious safety risks due to overloading**
  Because rack capacity and load were not digitally monitored, **racks were overloaded beyond safe limits**.
  ⚠️ **A rack collapsed twice in the company due to excessive weight**. Fortunately, **no personnel were harmed**, but these incidents highlighted **major operational and safety risks**.

* **Difficult to train new staff**
  New employees struggled to understand rack layouts, item locations, and stock levels without a centralized system.

---

## ✅ Solution: RackTrack

RackTrack is a **mobile-first, safety-driven inventory management system** that provides:

* Centralized rack and shelf tracking
* Real-time inventory visibility
* SAP-based item identification
* Rack load monitoring with capacity awareness
* Easy-to-use interface for shop-floor workers

> *RackTrack was initiated after real-world safety incidents, aiming to prevent future accidents through better visibility, accountability, and data-driven inventory control.*

---

## 📱 Key Features

### 🔍 Rack Overview

* View all racks by line or area
* Expand racks to view shelves
* Expand shelves to view individual materials
* Rack load summary with capacity and usage percentage
* Color-coded load warning for near-full racks
* Filter racks by production lines (Frz Line, SUS Line, Choc Line, etc.)

### ➕ Item Management

* Add new items via **Rack → Shelf → SAP Code Scan → Add Form**
* Update material quantity and pallet information
* Remove items with quantity control
* Material search by SAP code or by rack and shelf
* Total weight calculation per shelf and per rack

### 📸 Barcode Scanning

* Scan material SAP codes using device camera
* Fetch material data from backend
* Navigate directly to add material form

### 🧭 User Experience

* One-tap **Back to Home** navigation
* Clean industrial UI, optimized for warehouse use
* Minimal training required for new operators
* Expandable sections for shelves and materials

### 💾 Persistent Data

* Data is fetched from REST API endpoints
* Offline state not yet implemented (planned)
* Redux persist can be added for state storage

---

## 🧱 Tech Stack

### 📱 Frontend (Mobile Application)

* React Native + Expo
* Expo Router for screen navigation
* Redux Toolkit + Thunks for state management
* Axios for API requests
* Vector Icons for UI

### 🌐 Backend

* Node.js + Express
* RESTful APIs
* Serverless or traditional database for racks, shelves, and materials

---

## 📂 Project Structure

```
racktrack/
│
├── app/
│   ├── index.js                     # Home Screen / Dashboard
│   ├── rackOverview/
│   │   ├── index.js                 # Rack Overview Screen
│   │   └── [rack]/index.js          # Shelves & Material Details
│   ├── addMaterial/
│   │   ├── index.js                 # Select Line & Rack
│   │   └── addFormScan.js           # Add Material Form (after scan)
│   ├── [rack]/index.js               # Rack → Shelf Grid
│   ├── [rack]/scan.js                # Camera Scan for SAP Code
│   ├── removeMaterial/
│   │   └── index.js                  # Remove Material Screen
│   └── searchMaterial/
│       └── index.js                  # Search Material Screen
│
├── components/
│   └── ui/
│       ├── AppHeader.js
│       ├── InputField.js
│       └── PrimaryButton.js
│
├── constants/
│   └── colors.js                     # Theme Colors
│
└── README.md
```

---

## 🔌 API Endpoints

### 📦 Rack APIs

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/v1/racks`               | Fetch all racks          |
| GET    | `/api/v1/racks/:rack/shelves` | Fetch shelves for a rack |
| GET    | `/api/v1/racks/:id`           | Get rack by ID           |
| POST   | `/api/v1/racks`               | Create a rack            |
| PUT    | `/api/v1/racks/:id`           | Update rack info         |
| DELETE | `/api/v1/racks/:id`           | Delete a rack            |

### 📦 Material / Rack-Item APIs

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/api/v1/materials/:sapCode` | Fetch material by SAP code    |
| GET    | `/api/v1/rack-items/search`  | Search by SAP or rack & shelf |
| POST   | `/api/v1/rack-items`         | Add material to rack          |
| DELETE | `/api/v1/rack-items`         | Remove material from rack     |

---

## 🧠 State Management

* **Redux Toolkit** – centralized, predictable state
* **Redux Thunk** – asynchronous API actions
* **Optional Redux Persist** – for offline persistence
* UI updates automatically when state changes

---

## ▶️ Running the Project

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Varunyadavgithub/RackTrack.git
cd racktrack
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Expo

```bash
npx expo start
```

### 4️⃣ Run on Device

* Scan QR using **Expo Go**
* Or use Android Emulator / iOS Simulator

---

## 🔮 Future Enhancements

* 📷 Barcode / QR scanning for SAP codes (already implemented, refine UX)
* ⚠️ Rack load & capacity warnings (visual indicators)
* 🔄 Real-time updates via WebSockets
* 📴 Offline-first support with Redux Persist
* 🔐 Role-based access control (Admin / Operator)
* 📊 Inventory analytics dashboard
* 🌐 Web dashboard for supervisors

---

## 🏢 Target Users

* Warehouse operators
* Storekeepers
* Production supervisors
* Safety officers
* Inventory auditors
* Manufacturing plants

---

## 👨‍💻 Author

**Varun Yadav**
MERN Stack Developer | React Native | Full Stack Engineer
Focused on building **real-world, safety-first industrial software solutions**.

---

## 📜 License

This project is developed for **internal enterprise use**.
Commercial use or redistribution requires prior permission.

---

I’ve **updated the README to include all current screens, navigation, barcode scanning, rack/shelf/weight calculations, and material management flows**.

If you want, I can also **add a visual flow diagram showing Rack → Shelf → Scan → Add Material**, which makes the README much more readable for non-technical users.

Do you want me to create that diagram too?
