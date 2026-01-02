import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { COLORS } from "@/constants/colors";
import AppHeader from "@/components/ui/AppHeader";

const ShelvesScreen = () => {
  const { rackName } = useLocalSearchParams();

  // 🔹 Mock shelf items
  const mockShelfItems = {
    A1: [
      {
        id: 1,
        material_name: "SS430 HL",
        sap_code: "1103390",
        quantity: 10,
        material_weight: 0.01,
        material_description: "Sensor holder plate",
      },
      {
        id: 2,
        material_name: "MS Plate",
        sap_code: "1103391",
        quantity: 5,
        material_weight: 0.5,
        material_description: "Mounting plate",
      },
    ],
    A2: [
      {
        id: 3,
        material_name: "Aluminium Sheet",
        sap_code: "1103400",
        quantity: 20,
        material_weight: 0.2,
        material_description: "Aluminium sheet raw",
      },
    ],
    A3: [
      {
        id: 4,
        material_name: "Copper Wire",
        sap_code: "1103500",
        quantity: 50,
        material_weight: 0.05,
        material_description: "Copper wiring roll",
      },
    ],
  };

  const shelves = Object.keys(mockShelfItems);
  const [expandedShelf, setExpandedShelf] = useState(null);

  const toggleShelf = (shelfName) => {
    setExpandedShelf((prev) => (prev === shelfName ? null : shelfName));
  };

  const renderItem = (item) => {
    const totalWeight = (item.quantity || 0) * (item.material_weight || 0);

    return (
      <View
        key={item.id}
        style={{
          marginBottom: 12,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <Text style={{ fontWeight: "700", color: COLORS.text, fontSize: 16 }}>
          {item.material_name}
        </Text>
        <Text style={{ color: COLORS.textLight }}>SAP: {item.sap_code}</Text>
        <Text style={{ color: COLORS.textLight }}>Qty: {item.quantity}</Text>
        <Text style={{ color: COLORS.textLight }}>
          Unit Weight: {item.material_weight} kg
        </Text>
        <Text style={{ color: COLORS.textLight, fontWeight: "600" }}>
          Total: {totalWeight} kg
        </Text>
        {item.material_description && (
          <Text
            style={{
              color: COLORS.textLight,
              fontStyle: "italic",
              marginTop: 4,
            }}
          >
            {item.material_description}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <AppHeader title="Back to Racks" />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 12,
          color: COLORS.text,
        }}
      >
        Shelves – {rackName?.toUpperCase()}
      </Text>

      {shelves.map((shelfName) => {
        const isExpanded = expandedShelf === shelfName;
        const items = mockShelfItems[shelfName];
        const totalShelfWeight = items.reduce(
          (sum, item) =>
            sum + (item.quantity || 0) * (item.material_weight || 0),
          0
        );

        return (
          <View
            key={shelfName}
            style={{
              marginHorizontal: 16,
              marginVertical: 8,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {/* Shelf Header */}
            <Pressable
              onPress={() => toggleShelf(shelfName)}
              style={{
                padding: 16,
                backgroundColor: COLORS.primary,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                Shelf {shelfName}
              </Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {isExpanded ? "▲" : "▼"}
              </Text>
            </Pressable>

            {/* Shelf Total Weight */}
            {isExpanded && (
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: "#e6f0ff",
                }}
              >
                <Text style={{ fontWeight: "600", color: COLORS.text }}>
                  Total Shelf Weight: {totalShelfWeight} kg
                </Text>
              </View>
            )}

            {/* Shelf Items */}
            {isExpanded && (
              <View style={{ padding: 16 }}>
                {items.map((item) => renderItem(item))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ShelvesScreen;
