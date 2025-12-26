import { View, Text } from "react-native";
import { COLORS } from "@/constants/colors.js";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useState } from "react";

const index = () => {
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.text }}>
        Search Items
      </Text>
      <InputField placeholder="Rack Number" value={rack} onChange={setRack} />
      <InputField
        placeholder="Shelf Number"
        value={shelf}
        onChange={setShelf}
      />
      <InputField
        placeholder="SAP Code"
        value={sapCode}
        onChange={setSapCode}
      />
      <PrimaryButton title="Search" onPress={() => {}} />
    </View>
  );
};

export default index;
