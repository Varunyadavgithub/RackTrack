import { View, Text, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AppHeader from "../../components/ui/AppHeader";
import { addItem } from "../redux/api/itemThunks.js";

const Index = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.items);

  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("");

  const handleSave = async () => {
    if (!rack || !shelf || !sapCode || !itemName || !qty) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    const newItem = {
      rackNumber: rack,
      shelfNumber: shelf,
      sapCode: sapCode,
      itemName: itemName,
      description: description,
      quantity: Number(qty),
    };

    try {
      const response = await dispatch(addItem(newItem)).unwrap();
      Alert.alert("Success", "Item added successfully!");
      // Clear inputs after saving
      setRack("");
      setShelf("");
      setSapCode("");
      setItemName("");
      setDescription("");
      setQty("");
    } catch (err) {
      console.log("Add item error:", err);
      Alert.alert("Error", err || "Failed to add item.");
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
        Add New Item
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
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <InputField
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
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
        <PrimaryButton title="Save" onPress={handleSave} />
      )}

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </View>
  );
};

export default Index;
