import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors.js";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppHeader from "../../components/ui/AppHeader";
import { searchItem } from "../../redux/api/itemThunks.js";

const SearchItems = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.items);

  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    setResult(null);

    // Build query string
    let query = "";
    if (sapCode) query = `sap=${sapCode}`;
    else if (rack && shelf) query = `rack=${rack}&shelf=${shelf}`;
    else {
      setResult("NOT_FOUND");
      return;
    }

    try {
      const response = await dispatch(searchItem(query)).unwrap();
      if (!response || (Array.isArray(response) && response.length === 0)) {
        setResult("NOT_FOUND");
      } else {
        setResult(response);
      }
    } catch (err) {
      console.log("Search API error:", err);
      setResult("NOT_FOUND");
    }
  };

  // Helper to render a single item
  const renderItem = (item) => (
    <View
      key={item.item_id}
      style={{
        marginBottom: 12,
        padding: 10,
        borderRadius: 6,
        backgroundColor: COLORS.card,
      }}
    >
      <Text style={{ fontWeight: "600", color: COLORS.text }}>
        {item.item_name}
      </Text>
      <Text style={{ color: COLORS.textLight }}>SAP Code: {item.sap_code}</Text>
      <Text style={{ color: COLORS.textLight }}>Quantity: {item.quantity}</Text>
      {item.description && (
        <Text style={{ color: COLORS.textLight }}>{item.description}</Text>
      )}
      <Text
        style={{
          fontSize: 12,
          color: COLORS.textLight,
          marginTop: 2,
        }}
      >
        Rack: {item.rack_number} | Shelf: {item.shelf_number}
      </Text>
    </View>
  );

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

      <InputField
        placeholder="Rack Number"
        value={rack}
        onChangeText={setRack}
      />
      <InputField
        placeholder="Shelf Number"
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
            result.map((item) => renderItem(item))
          ) : (
            renderItem(result)
          )}
        </View>
      )}

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </ScrollView>
  );
};

export default SearchItems;
