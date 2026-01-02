import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { COLORS } from "@/constants/colors.js";
import AppHeader from "../../components/ui/AppHeader";

/* ===============================
   SAFE NUMBER CONVERTER
================================ */
const toNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const RackOverview = () => {


  const [expandedRack, setExpandedRack] = useState(null);
  const [expandedShelf, setExpandedShelf] = useState(null);
  const [selectedLine, setSelectedLine] = useState("All");



  const lines = useMemo(() => {
    const uniqueLocations = Array.from(new Set(racks.map((r) => r.location)));
    return ["All", ...uniqueLocations];
  }, [racks]);

  const toggleRack = (rackId) => {
    setExpandedRack((prev) => (prev === rackId ? null : rackId));
    setExpandedShelf(null);
  };

  const toggleShelf = (shelfId) => {
    setExpandedShelf((prev) => (prev === shelfId ? null : shelfId));
  };

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

      {/* ================= LINE FILTERS ================= */}
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
            style={{ flexDirection: "row", alignItems: "center", padding: 6 }}
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

      {/* ================= RACK LIST ================= */}
      <FlatList
        data={filteredRacks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          /* ---------- RACK TOTAL WEIGHT ---------- */
          const rackTotalWeight = item.shelves.reduce((rackAcc, shelf) => {
            const shelfWeight = shelf.items.reduce((shelfAcc, it) => {
              const qty = toNumber(it.quantity);
              const single = toNumber(it.singleItemWeightKg);
              const pallet = toNumber(it.woodenPalletWeightKg);

              return shelfAcc + qty * single + pallet;
            }, 0);

            return rackAcc + shelfWeight;
          }, 0);

          const shelfCount = item.shelves.length;
          const itemCount = item.shelves.reduce(
            (acc, shelf) => acc + shelf.items.length,
            0
          );

          return (
            <View
              style={{
                backgroundColor: COLORS.card,
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
              }}
            >
              {/* ---------- RACK HEADER ---------- */}
              <Pressable onPress={() => toggleRack(item._id)}>
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
                  Shelves: {shelfCount} | Items: {itemCount}
                </Text>

                <Text style={{ color: COLORS.textLight }}>
                  Capacity: {item.capacity} kg
                </Text>

                <Text style={{ color: COLORS.textLight }}>
                  Current Load: {rackTotalWeight.toFixed(2)} kg
                </Text>
              </Pressable>

              {/* ---------- SHELVES ---------- */}
              {expandedRack === item._id &&
                item.shelves.map((shelf) => {
                  const shelfTotalWeight = shelf.items.reduce((total, it) => {
                    const qty = toNumber(it.quantity);
                    const single = toNumber(it.singleItemWeightKg);
                    const pallet = toNumber(it.woodenPalletWeightKg);

                    return total + qty * single + pallet;
                  }, 0);

                  return (
                    <View
                      key={shelf._id}
                      style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: COLORS.background,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                      }}
                    >
                      {/* ---------- SHELF HEADER ---------- */}
                      <Pressable
                        onPress={() => toggleShelf(shelf._id)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontWeight: "600" }}>
                          Shelf {shelf.shelfNumber}
                        </Text>
                        <Text style={{ color: COLORS.textLight }}>
                          Total Items: {shelf.items.length}
                        </Text>
                        <Text style={{ color: COLORS.textLight }}>
                          Total Weight: {shelfTotalWeight.toFixed(2)} kg
                        </Text>
                      </Pressable>

                      {/* ---------- ITEMS ---------- */}
                      {expandedShelf === shelf._id &&
                        shelf.items.map((it) => {
                          const itemTotalWeight =
                            toNumber(it.quantity) *
                              toNumber(it.singleItemWeightKg) +
                            toNumber(it.woodenPalletWeightKg);

                          return (
                            <View
                              key={it._id}
                              style={{
                                marginTop: 8,
                                padding: 8,
                                backgroundColor: COLORS.card,
                                borderRadius: 6,
                              }}
                            >
                              <Text style={{ fontWeight: "600" }}>
                                {it.itemName}
                              </Text>
                              <Text>SAP Code: {it.sapCode}</Text>
                              <Text>Quantity: {it.quantity}</Text>
                              <Text>
                                Single Weight: {it.singleItemWeightKg} kg
                              </Text>
                              <Text>
                                Pallet Weight: {it.woodenPalletWeightKg} kg
                              </Text>
                              <Text style={{ fontWeight: "600" }}>
                                Total Weight: {itemTotalWeight.toFixed(2)} kg
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  );
                })}
            </View>
          );
        }}
      />
    </View>
  );
};

export default RackOverview;
