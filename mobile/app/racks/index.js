import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { COLORS } from "@/constants/colors.js";

const DUMMY_RACKS = [
  {
    rackNumber: "RACK-01",
    shelves: [
      { shelfNumber: "S1", items: 12 },
      { shelfNumber: "S2", items: 8 },
    ],
  },
  {
    rackNumber: "RACK-02",
    shelves: [
      { shelfNumber: "S1", items: 20 },
      { shelfNumber: "S2", items: 5 },
      { shelfNumber: "S3", items: 15 },
    ],
  },
];

export default function RackOverview() {
  const [expandedRack, setExpandedRack] = useState(null);

  const toggleRack = (rackNumber) => {
    setExpandedRack(expandedRack === rackNumber ? null : rackNumber);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: COLORS.text,
          marginBottom: 12,
        }}
      >
        Rack Overview
      </Text>

      <FlatList
        data={DUMMY_RACKS}
        keyExtractor={(item) => item.rackNumber}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              shadowColor: COLORS.shadow,
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {/* Rack Header */}
            <Pressable onPress={() => toggleRack(item.rackNumber)}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
              >
                {item.rackNumber}
              </Text>
              <Text style={{ color: COLORS.textLight }}>
                Total Shelves: {item.shelves.length}
              </Text>
            </Pressable>

            {/* Shelves */}
            {expandedRack === item.rackNumber && (
              <View style={{ marginTop: 10 }}>
                {item.shelves.map((shelf) => (
                  <View
                    key={shelf.shelfNumber}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      borderRadius: 8,
                      marginBottom: 6,
                      backgroundColor: COLORS.background,
                    }}
                  >
                    <Text style={{ color: COLORS.text }}>
                      Shelf: {shelf.shelfNumber}
                    </Text>
                    <Text style={{ color: COLORS.textLight }}>
                      Items: {shelf.items}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
