import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors.js";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AppHeader from "../../components/ui/AppHeader";

const AddItem = () => {
  const router = useRouter();
  const lines = ["All", "Freezer Line", "SUS Line", "Choc. Line"];
  const [selectedLine, setSelectedLine] = useState("All");

  const racks = [
    { name: "rack01", line: "Freezer Line" },
    { name: "rack02", line: "SUS Line" },
    { name: "rack03", line: "Choc. Line" },
    { name: "rack04", line: "Freezer Line" },
  ];

  const filteredRacks =
    selectedLine === "All"
      ? racks
      : racks.filter((rack) => rack.line === selectedLine);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AppHeader title="Back to Home" />

      {/* Line Selector */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {lines.map((line) => (
          <Pressable
            key={line}
            onPress={() => setSelectedLine(line)}
            style={{ flexDirection: "row", alignItems: "center", padding: 6 }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 6,
              }}
            >
              {selectedLine === line && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.primary,
                  }}
                />
              )}
            </View>
            <Text style={{ color: COLORS.text }}>{line}</Text>
          </Pressable>
        ))}
      </View>

      {/* Racks */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: COLORS.text,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        {selectedLine === "All" ? "All Racks" : `${selectedLine} Racks`}
      </Text>

      {filteredRacks.map((rack) => (
        <PrimaryButton
          key={rack.name}
          title={rack.name.toUpperCase()}
          onPress={() => router.push(`/addItem/${rack.name}`)}
        />
      ))}
    </View>
  );
};

export default AddItem;
