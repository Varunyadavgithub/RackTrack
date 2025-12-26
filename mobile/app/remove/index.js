import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors.js";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AppHeader from "../../components/ui/AppHeader";

const index = () => {
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [qty, setQty] = useState("");
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
        Remove New Items
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
      <InputField placeholder="Quantity" value={qty} onChangeText={setQty} />
      <PrimaryButton title="Remove Item" onPress={() => {}} />
    </View>
  );
};

export default index;
