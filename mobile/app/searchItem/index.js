import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors.js";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useState } from "react";
import AppHeader from "../../components/ui/AppHeader";

const SearchItems = () => {
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setResult(null);
    setError("");
    setLoading(true);

    // Build query string
    let query = "";
    if (sapCode) query = `sapCode=${sapCode}`;
    else if (rack && shelf) query = `rackNumber=${rack}&shelfNumber=${shelf}`;
    else {
      setResult("NOT_FOUND");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://10.100.95.54:5000/api/v1/rack-items/search?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok || !data || data.length === 0) {
        setResult("NOT_FOUND");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.log("Search API error:", err);
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  // Render a single item, showing total weight per item
  const renderItem = (item) => {
    const itemTotalWeight = (item.quantity || 0) * (item.material_weight || 0);

    return (
      <View
        key={item.id}
        style={{
          marginBottom: 12,
          padding: 10,
          borderRadius: 6,
          backgroundColor: COLORS.card,
        }}
      >
        <Text style={{ fontWeight: "600", color: COLORS.text }}>
          Material: {item.material_name}
        </Text>
        <Text style={{ color: COLORS.textLight }}>
          SAP Code: {item.sap_code}
        </Text>
        <Text style={{ color: COLORS.textLight }}>
          Quantity: {item.quantity}
        </Text>
        <Text style={{ color: COLORS.textLight }}>
          Unit Weight: {item.material_weight}
        </Text>
        <Text style={{ color: COLORS.textLight }}>
          Total Weight: {itemTotalWeight} kg
        </Text>
        {item.material_description && (
          <Text style={{ color: COLORS.textLight }}>
            Description: {item.material_description}
          </Text>
        )}
        <Text
          style={{
            fontSize: 12,
            color: COLORS.textLight,
            marginTop: 2,
          }}
        >
          Rack: {item.rack_name} | Shelf: {item.shelf_name}
        </Text>
      </View>
    );
  };

  // Calculate total shelf weight only if rack and shelf are entered
  const totalShelfWeight =
    rack && shelf && Array.isArray(result)
      ? result.reduce(
          (sum, item) =>
            sum + (item.quantity || 0) * (item.material_weight || 0),
          0
        )
      : null;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <AppHeader title="Back to Home" />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 10,
          color: COLORS.text,
        }}
      >
        Search Items
      </Text>

      <InputField placeholder="Rack Name" value={rack} onChangeText={setRack} />
      <InputField
        placeholder="Shelf Name"
        value={shelf}
        onChangeText={setShelf}
      />
      <InputField
        placeholder="SAP Code"
        value={sapCode}
        onChangeText={setSapCode}
      />

      <PrimaryButton
        title={loading ? "Searching..." : "Search"}
        onPress={handleSearch}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {/* Result Display */}
      {result && (
        <View
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#f2f2f2",
            borderRadius: 8,
          }}
        >
          {result === "NOT_FOUND" ? (
            <Text style={{ color: "red", textAlign: "center" }}>
              Item not found
            </Text>
          ) : Array.isArray(result) ? (
            <>
              {/* Show total shelf weight only if rack and shelf are entered */}
              {totalShelfWeight !== null && (
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    marginBottom: 10,
                    color: COLORS.text,
                  }}
                >
                  Total Shelf Weight: {totalShelfWeight} kg
                </Text>
              )}

              {/* Render each item */}
              {result.map((item) => renderItem(item))}
            </>
          ) : (
            renderItem(result)
          )}
        </View>
      )}

      {error ? (
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
      ) : null}
    </ScrollView>
  );
};

export default SearchItems;
