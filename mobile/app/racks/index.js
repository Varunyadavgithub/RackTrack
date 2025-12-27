import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "@/constants/colors.js";
import AppHeader from "../../components/ui/AppHeader";
import { fetchRacks } from "@/store/racks/rackThunks";

const index = () => {
  const dispatch = useDispatch();

  const { list: racks, loading, error } = useSelector((state) => state.racks);

  const [expandedRack, setExpandedRack] = useState(null);
  const [selectedLine, setSelectedLine] = useState("All");

  useEffect(() => {
    dispatch(fetchRacks());
  }, []);

  const toggleRack = (rackNumber) => {
    setExpandedRack(expandedRack === rackNumber ? null : rackNumber);
  };

  const lines = ["All", "Frz. Line", "SUS Line", "Choc Line"];

  const filteredRacks = useMemo(() => {
    if (selectedLine === "All") return racks;
    return racks.filter((rack) => rack.location === selectedLine);
  }, [racks, selectedLine]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

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

      {/* Line Filters */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {lines.map((line) => (
          <Pressable
            key={line}
            onPress={() => setSelectedLine(line)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 6,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 6,
              }}
            >
              {selectedLine === line && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.primary,
                  }}
                />
              )}
            </View>
            <Text style={{ color: COLORS.text }}>{line}</Text>
          </Pressable>
        ))}
      </View>

      {/* Racks */}
      <FlatList
        data={filteredRacks}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: COLORS.textLight }}>
            No racks found
          </Text>
        }
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
                      <Text
                        style={{
                          fontWeight: "600",
                          color: COLORS.text,
                        }}
                      >
                        Shelf {shelf.shelfNumber}
                      </Text>

                      <Text style={{ color: COLORS.textLight }}>
                        Total Items: {shelf.items.length}
                      </Text>
                    </View>

                    {shelf.items.map((item) => (
                      <View
                        key={item._id}
                        style={{
                          padding: 8,
                          marginTop: 6,
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

                        {item.description && (
                          <Text style={{ color: COLORS.textLight }}>
                            {item.description}
                          </Text>
                        )}

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
