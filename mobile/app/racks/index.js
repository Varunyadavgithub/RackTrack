import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { COLORS } from "@/constants/colors.js";
import AppHeader from "../../components/ui/AppHeader";
import { DUMMY_RACKS } from "@/constants/dummyData.js";

const index = () => {
  const [expandedRack, setExpandedRack] = useState(null);

  const toggleRack = (rackNumber) => {
    setExpandedRack(expandedRack === rackNumber ? null : rackNumber);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <AppHeader title="Back to Home" />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: COLORS.text,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Rack Overview
      </Text>

      <FlatList
        data={DUMMY_RACKS}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
              elevation: 3,
            }}
          >
            {/* Rack Header */}
            <Pressable onPress={() => toggleRack(item.rackNumber)}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: COLORS.primary,
                }}
              >
                {item.rackNumber}
              </Text>

              <Text style={{ color: COLORS.textLight }}>
                Location: {item.location} | Area: {item.area}
              </Text>

              <Text style={{ color: COLORS.textLight }}>
                Capacity: {item.capacity}
              </Text>
            </Pressable>

            {/* Shelves */}
            {expandedRack === item.rackNumber && (
              <View style={{ marginTop: 12 }}>
                {item.shelves.map((shelf) => (
                  <View
                    key={shelf._id}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      marginBottom: 10,
                      backgroundColor: COLORS.background,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {/* Shelf Header */}
                      <Text
                        style={{
                          fontWeight: "600",
                          color: COLORS.text,
                          marginBottom: 4,
                        }}
                      >
                        Shelf {shelf.shelfNumber}
                      </Text>

                      <Text
                        style={{ color: COLORS.textLight, marginBottom: 6 }}
                      >
                        Total Items: {shelf.items.length}
                      </Text>
                    </View>

                    {/* Items */}
                    {shelf.items.map((item) => (
                      <View
                        key={item._id}
                        style={{
                          padding: 8,
                          marginBottom: 6,
                          borderRadius: 6,
                          backgroundColor: COLORS.card,
                        }}
                      >
                        <Text style={{ fontWeight: "600", color: COLORS.text }}>
                          {item.itemName}
                        </Text>

                        <Text style={{ color: COLORS.textLight }}>
                          SAP Code: {item.sapCode}
                        </Text>

                        <Text style={{ color: COLORS.textLight }}>
                          Quantity: {item.quantity}
                        </Text>

                        {item.description ? (
                          <Text style={{ color: COLORS.textLight }}>
                            {item.description}
                          </Text>
                        ) : null}

                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.textLight,
                            marginTop: 2,
                          }}
                        >
                          Last Updated:{" "}
                          {new Date(item.lastUpdated).toLocaleString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default index;
