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

const ShelvesScreen = () => {
  const router = useRouter(); // ✅ router for navigation
  const { rack } = useLocalSearchParams();

  const [shelves, setShelves] = useState([]);
  const [shelfItems, setShelfItems] = useState({});
  const [expandedShelf, setExpandedShelf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rack) return;

    const fetchItems = async () => {
      setLoading(true);
      setError("");

      try {
        const query = `rackNumber=${rack}`;
        const response = await fetch(
          `http://10.100.95.54:5000/api/v1/rack-items/search?${query}`
        );
        const data = await response.json();

        if (!response.ok || !Array.isArray(data) || data.length === 0) {
          setError("No items found for this rack.");
          return;
        }

        const uniqueShelves = [...new Set(data.map((item) => item.shelf_name))];
        setShelves(uniqueShelves);

        const grouped = {};
        uniqueShelves.forEach((shelf) => {
          grouped[shelf] = data.filter((item) => item.shelf_name === shelf);
        });
        setShelfItems(grouped);
      } catch (err) {
        setError("Failed to fetch shelf items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [rack]);

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
      {/* Pass onPress for back button */}
      <AppHeader title="Back to Racks" onPress={() => router.back()} />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 12,
          color: COLORS.text,
        }}
      >
        Shelves – {rack?.toUpperCase()}
      </Text>

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

      {shelves.map((shelfName) => {
        const isExpanded = expandedShelf === shelfName;
        const items = shelfItems[shelfName] || [];
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
