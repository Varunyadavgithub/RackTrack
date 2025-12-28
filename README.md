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

  ⚠️ **A rack collapsed twice in the company due to excessive weight**. Fortunately, **no personnel were harmed**, but these incidents clearly highlighted a **major safety and operational risk**.

* **Difficult to train new staff**
  New employees struggled to understand rack layouts, item locations, and stock levels without a centralized system.

---

## ✅ Solution: RackTrack

RackTrack was designed as a **safety-driven, mobile-first inventory management system** that provides:

* Centralized rack and shelf tracking
* Real-time inventory visibility
* SAP-based item identification
* Safer load distribution awareness
* Easy-to-use interface for shop-floor workers

> *RackTrack was initiated after real-world safety incidents, with the goal of preventing future accidents through better visibility, accountability, and data-driven inventory control.*

---

## 📱 Key Features

### 🔍 Rack Overview

* View all racks with location and area details
* Expand racks to view shelves
* Expand shelves to view items
* Filter racks by production lines (Frz Line, SUS Line, Choc Line, etc.)

### ➕ Item Management

* Add new items using:

  * Rack Number
  * Shelf Number
  * SAP Code
  * Item Name
  * Quantity
  * Description
* Update item quantity
* Remove items when consumed or relocated

### 🧭 User Experience

* One-tap **Back to Home** navigation
* Clean industrial UI
* Optimized for factory and warehouse usage
* Minimal training required

### 💾 Persistent Data

* Redux Persist ensures data remains available across app restarts
* Designed to work reliably in industrial environments

---

## 🧱 Tech Stack

### 📱 Frontend (Mobile Application)

* React Native
* Expo
* Expo Router
* Redux Toolkit
* Redux Thunk
* Redux Persist
* Axios
* Vector Icons

### 🌐 Backend

* Node.js
* Express.js
* Serverless Neo Database
* RESTful APIs

---

## 📂 Project Structure

```
racktrack/
│
├── app/
│   ├── index.js                # Home Screen
│   ├── racks/
│   │   └── index.js            # Rack Overview Screen
│   ├── add-item/
│   │   └── index.js            # Add Item Screen
│   └── _layout.jsx             # App Navigation Layout
│
├── components/
│   ├── ui/
│   │   ├── AppHeader.jsx
│   │   ├── InputField.jsx
│   │   └── PrimaryButton.jsx
│
├── store/
│   ├── index.js                # Redux Store
│   ├── racks/
│   │   ├── rackSlice.js
│   │   └── rackThunks.js
│   ├── items/
│   │   ├── itemSlice.js
│   │   └── itemThunks.js
│
├── constants/
│   └── colors.js               # Theme Configuration
│
├── utils/
│   └── axios.js                # Axios API Instance
│
└── README.md
```

---

## 🔌 API Endpoints

### 📦 Rack APIs

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| POST   | `/racks`     | Create a rack  |
| GET    | `/racks`     | Get all racks  |
| GET    | `/racks/:id` | Get rack by ID |
| PUT    | `/racks/:id` | Update rack    |
| DELETE | `/racks/:id` | Delete rack    |

### 📦 Item APIs

| Method | Endpoint        | Description  |
| ------ | --------------- | ------------ |
| POST   | `/items`        | Add new item |
| GET    | `/items/search` | Search item  |
| PUT    | `/items/:id`    | Update item  |
| DELETE | `/items/:id`    | Delete item  |

---

## 🧠 State Management

* Redux Toolkit for predictable state management
* Redux Thunk for async API calls
* Redux Persist for local data storage
* Automatic UI updates on state changes

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

* 📷 Barcode / QR scanning for SAP codes
* ⚠️ Rack load & capacity warnings
* 🔄 Real-time updates using WebSockets
* 📴 Offline-first support
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
