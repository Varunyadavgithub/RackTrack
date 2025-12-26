import { View, Text, ScrollView } from "react-native";
import { COLORS } from "@/constants/colors.js";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useState } from "react";
import AppHeader from "../../components/ui/AppHeader";
import {DUMMY_RACKS} from "@/constants/dummyData.js";

const index = () => {
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [sapCode, setSapCode] = useState("");
  const [result, setResult] = useState(null);

  // Function to search item
  const searchItem = ({ rackNumber, shelfNumber, sapCode }) => {
    if (sapCode) {
      // Search by SAP Code
      for (let rack of DUMMY_RACKS) {
        for (let shelf of rack.shelves) {
          const found = shelf.items.find(
            (item) => item.sapCode.toLowerCase() === sapCode.toLowerCase()
          );
          if (found) return found;
        }
      }
    } else if (rackNumber && shelfNumber) {
      // Search by Rack + Shelf
      const rackFound = DUMMY_RACKS.find(
        (r) => r.rackNumber.toLowerCase() === rackNumber.toLowerCase()
      );
      if (rackFound) {
        const shelfFound = rackFound.shelves.find(
          (s) => s.shelfNumber.toLowerCase() === shelfNumber.toLowerCase()
        );
        if (shelfFound) return shelfFound.items;
      }
    }

    return null; // Not found
  };

  const handleSearch = () => {
    const found = searchItem({ rackNumber: rack, shelfNumber: shelf, sapCode });
    setResult(found || "NOT_FOUND");
  };

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

      <PrimaryButton title="Search" onPress={handleSearch} />

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
            result.map((item) => (
              <View
                key={item._id}
                style={{
                  marginBottom: 12,
                  padding: 10,
                  borderRadius: 6,
                  backgroundColor: COLORS.card,
                }}
              >
                <Text style={{ fontWeight: "600", color: COLORS.text }}>
                  {item.itemName}
                </Text>
                <Text style={{ color: COLORS.textLight }}>
                  SAP Code: {item.sapCode}
                </Text>
                <Text style={{ color: COLORS.textLight }}>
                  Quantity: {item.quantity}
                </Text>
                {item.description ? (
                  <Text style={{ color: COLORS.textLight }}>
                    {item.description}
                  </Text>
                ) : null}
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textLight,
                    marginTop: 2,
                  }}
                >
                  Rack: {item.rackId} | Shelf: {item.shelfId}
                </Text>
              </View>
            ))
          ) : (
            <View>
              <Text style={{ fontWeight: "600", color: COLORS.text }}>
                {result.itemName}
              </Text>
              <Text style={{ color: COLORS.textLight }}>
                SAP Code: {result.sapCode}
              </Text>
              <Text style={{ color: COLORS.textLight }}>
                Quantity: {result.quantity}
              </Text>
              {result.description && (
                <Text style={{ color: COLORS.textLight }}>
                  {result.description}
                </Text>
              )}
              <Text
                style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}
              >
                Rack: {result.rackId} | Shelf: {result.shelfId}
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default index;
