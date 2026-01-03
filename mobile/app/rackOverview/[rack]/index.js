import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { COLORS } from "@/constants/colors";
import AppHeader from "@/components/ui/AppHeader";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const ShelvesScreen = () => {
  const router = useRouter();
  const { rack, capacity } = useLocalSearchParams();

  const [shelves, setShelves] = useState([]);
  const [shelfMaterials, setShelfMaterials] = useState({});
  const [expandedShelf, setExpandedShelf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rack) return;

    const fetchMaterials = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://10.100.95.54:5000/api/v1/rack-items/search?rackNumber=${rack}`
        );

        const data = await response.json();

        if (!response.ok || !Array.isArray(data) || data.length === 0) {
          setError("No materials found for this rack.");
          return;
        }

        const uniqueShelves = [...new Set(data.map((item) => item.shelf_name))];
        setShelves(uniqueShelves);

        const grouped = {};
        uniqueShelves.forEach((shelf) => {
          grouped[shelf] = data.filter((item) => item.shelf_name === shelf);
        });

        setShelfMaterials(grouped);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch shelf materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [rack]);

  const toggleShelf = (shelfName) => {
    setExpandedShelf((prev) => (prev === shelfName ? null : shelfName));
  };

  /* ✅ Calculate Rack Total Weight */
  const rackTotalWeight = Object.values(shelfMaterials).reduce(
    (rackSum, items) =>
      rackSum +
      items.reduce(
        (shelfSum, item) =>
          shelfSum + (item.quantity || 0) * (item.material_weight || 0),
        0
      ),
    0
  );

  const renderMaterial = (item) => {
    const totalWeight = (item.quantity || 0) * (item.material_weight || 0);

    return (
      <View
        key={item.id}
        style={{
          marginBottom: 12,
          padding: 12,
          borderRadius: 8,
          backgroundColor: COLORS.card,
          borderWidth: 1,
          borderColor: COLORS.border,
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
        <Text style={{ fontWeight: "600", color: COLORS.text }}>
          Total: {totalWeight.toFixed(2)} kg
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
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Back to Racks" onPress={() => router.back()} />

      {/* Rack Title */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 12,
          color: COLORS.text,
        }}
      >
        Shelves in Rack{" "}
        <Text style={{ color: COLORS.primary }}>{rack.toUpperCase()}</Text>
      </Text>

      {/* ✅ Rack Weight Summary */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          backgroundColor: COLORS.card,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text }}>
          Rack Load Summary
        </Text>

        {/* Capacity Info */}
        {capacity && (
          <>
            <Text style={{ color: COLORS.textLight, marginTop: 4 }}>
              Capacity: {capacity} kg
            </Text>

            {/* Current Weight */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: COLORS.primary,
                marginTop: 6,
              }}
            >
              Current Load: {rackTotalWeight.toFixed(2)} kg
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontWeight: "600",
                color:
                  rackTotalWeight / capacity >= 0.9
                    ? COLORS.expense
                    : COLORS.income,
              }}
            >
              Used: {((rackTotalWeight / capacity) * 100).toFixed(1)}%
            </Text>

            {/* Capacity Bar */}
            <View
              style={{
                height: 8,
                backgroundColor: COLORS.border,
                borderRadius: 4,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(
                    (rackTotalWeight / capacity) * 100,
                    100
                  )}%`,
                  backgroundColor:
                    rackTotalWeight / capacity >= 0.9
                      ? COLORS.expense
                      : COLORS.primary,
                }}
              />
            </View>
          </>
        )}
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {error}
        </Text>
      ) : null}

      {/* Shelves */}
      {shelves.map((shelfName) => {
        const isExpanded = expandedShelf === shelfName;
        const items = shelfMaterials[shelfName] || [];

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
              backgroundColor: COLORS.card,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="view-grid"
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  Shelf {shelfName}
                </Text>
              </View>

              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={22}
                color={COLORS.white}
              />
            </Pressable>

            {isExpanded && (
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontWeight: "600",
                    color: COLORS.text,
                    marginBottom: 8,
                  }}
                >
                  Shelf Weight: {totalShelfWeight.toFixed(2)} kg
                </Text>

                {items.map((item) => renderMaterial(item))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ShelvesScreen;
