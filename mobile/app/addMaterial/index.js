import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors.js";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AppHeader from "../../components/ui/AppHeader";

const AddMaterial = () => {
  const router = useRouter();
  const lines = ["All", "Freezer Line", "SUS Line", "Choc. Line"];
  const [selectedLine, setSelectedLine] = useState("All");
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRacks = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://10.100.95.54:5000/api/v1/racks");

        if (!response.ok) {
          throw new Error("Failed to fetch racks");
        }

        const data = await response.json();
        setRacks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRacks();
  }, []);

  const filteredRacks =
    selectedLine === "All"
      ? racks
      : racks.filter((rack) => rack.location === selectedLine);

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

      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      )}

      {/* Racks */}
      {!loading && !error && (
        <>
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
        </>
      )}

      {filteredRacks.map((rack) => (
        <PrimaryButton
          key={rack.id}
          title={rack.rack_name.toUpperCase()}
          onPress={() => router.push(`/addMaterial/${rack.rack_name}`)}
        />
      ))}
    </View>
  );
};

export default AddMaterial;
