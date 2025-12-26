export const DUMMY_RACKS = [
  // Frz. Line
  {
    _id: "RK01",
    rackNumber: "RACK-01",
    location: "Frz. Line",
    area: "Part Process",
    capacity: "5000 kg",
    shelves: [
      {
        _id: "SL01",
        rackId: "RK01",
        shelfNumber: "S1",
        items: [
          {
            _id: "IT01",
            sapCode: "SAP12345",
            itemName: "Compressor",
            description: "High-pressure refrigeration compressor",
            quantity: 1200,
            rackId: "RK01",
            shelfId: "SL01",
            lastUpdated: "2025-12-26T12:30:00Z",
          },
          {
            _id: "IT02",
            sapCode: "SAP12346",
            itemName: "Condenser Coil",
            description: "Copper condenser coil for cooling units",
            quantity: 850,
            rackId: "RK01",
            shelfId: "SL01",
            lastUpdated: "2025-12-25T09:15:00Z",
          },
        ],
      },
      {
        _id: "SL02",
        rackId: "RK01",
        shelfNumber: "S2",
        items: [
          {
            _id: "IT03",
            sapCode: "SAP12347",
            itemName: "Evaporator Fan",
            description: "Axial fan for evaporator airflow",
            quantity: 640,
            rackId: "RK01",
            shelfId: "SL02",
            lastUpdated: "2025-12-24T16:45:00Z",
          },
          {
            _id: "IT04",
            sapCode: "SAP12348",
            itemName: "Expansion Valve",
            description: "Thermostatic expansion valve",
            quantity: 420,
            rackId: "RK01",
            shelfId: "SL02",
            lastUpdated: "2025-12-23T11:10:00Z",
          },
        ],
      },
    ],
  },

  // SUS Line
  {
    _id: "RK02",
    rackNumber: "RACK-02",
    location: "SUS Line",
    area: "Assembly",
    capacity: "3000 kg",
    shelves: [
      {
        _id: "SL01",
        rackId: "RK02",
        shelfNumber: "S1",
        items: [
          {
            _id: "IT05",
            sapCode: "SAP22345",
            itemName: "Stainless Panel",
            description: "Stainless steel panel for assembly",
            quantity: 500,
            rackId: "RK02",
            shelfId: "SL01",
            lastUpdated: "2025-12-20T10:00:00Z",
          },
          {
            _id: "IT06",
            sapCode: "SAP22346",
            itemName: "SUS Screws",
            description: "Set of stainless steel screws",
            quantity: 2000,
            rackId: "RK02",
            shelfId: "SL01",
            lastUpdated: "2025-12-19T15:30:00Z",
          },
        ],
      },
      {
        _id: "SL02",
        rackId: "RK02",
        shelfNumber: "S2",
        items: [
          {
            _id: "IT07",
            sapCode: "SAP22347",
            itemName: "Bracket",
            description: "Mounting bracket for SUS Line",
            quantity: 750,
            rackId: "RK02",
            shelfId: "SL02",
            lastUpdated: "2025-12-18T09:20:00Z",
          },
        ],
      },
    ],
  },

  // Choc Line
  {
    _id: "RK03",
    rackNumber: "RACK-03",
    location: "Choc Line",
    area: "Processing",
    capacity: "4000 kg",
    shelves: [
      {
        _id: "SL01",
        rackId: "RK03",
        shelfNumber: "S1",
        items: [
          {
            _id: "IT08",
            sapCode: "SAP32345",
            itemName: "Chocolate Mixer",
            description: "Mixer for chocolate production",
            quantity: 3,
            rackId: "RK03",
            shelfId: "SL01",
            lastUpdated: "2025-12-21T14:00:00Z",
          },
          {
            _id: "IT09",
            sapCode: "SAP32346",
            itemName: "Tempering Machine",
            description: "Chocolate tempering machine",
            quantity: 2,
            rackId: "RK03",
            shelfId: "SL01",
            lastUpdated: "2025-12-20T11:45:00Z",
          },
        ],
      },
    ],
  },

  // Free sample line (optional example for diversity)
  {
    _id: "RK04",
    rackNumber: "RACK-04",
    location: "Frz. Line",
    area: "Packaging",
    capacity: "2500 kg",
    shelves: [
      {
        _id: "SL01",
        rackId: "RK04",
        shelfNumber: "S1",
        items: [
          {
            _id: "IT10",
            sapCode: "SAP42345",
            itemName: "Packaging Box",
            description: "Cold storage packaging boxes",
            quantity: 1500,
            rackId: "RK04",
            shelfId: "SL01",
            lastUpdated: "2025-12-18T08:30:00Z",
          },
        ],
      },
    ],
  },
];
