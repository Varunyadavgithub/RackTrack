import { View, Text, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors.js";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AppHeader from "../../components/ui/AppHeader";

const RemoveMaterial = () => {
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [qty, setQty] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!rack || !shelf || !sapCode || !qty) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    const payload = {
      rackNumber: rack,
      shelfNumber: shelf,
      sapCode: sapCode,
      quantity: Number(qty),
    };

    setLoading(true);
    setError("");

    try {
      // Call your backend DELETE API
      const response = await fetch("http://10.100.95.54:5000/api/v1/rack-items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to remove material");

      Alert.alert("Success", data.message);

      // Clear form
      setRack("");
      setShelf("");
      setSapCode("");
      setQty("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AppHeader title="Back to Home" />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: COLORS.text,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Remove Material from Rack
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
      <InputField
        placeholder="Quantity"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <PrimaryButton title="Remove" onPress={handleDelete} />
      )}

      {error ? (
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
      ) : null}
    </View>
  );
};

export default RemoveMaterial;
