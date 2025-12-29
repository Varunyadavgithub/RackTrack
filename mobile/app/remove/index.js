import { View, Text, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AppHeader from "../../components/ui/AppHeader";
import { deleteItem } from "../redux/api/itemThunks.js";

const index = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.items);

  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [qty, setQty] = useState("");

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

    try {
      await dispatch(deleteItem(payload)).unwrap();
      Alert.alert("Success", "Item quantity removed successfully");

      // Clear form
      setRack("");
      setShelf("");
      setSapCode("");
      setQty("");
    } catch (err) {
      Alert.alert("Error", err || "Failed to remove item");
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
        Remove Items
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
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </View>
  );
};

export default index;
