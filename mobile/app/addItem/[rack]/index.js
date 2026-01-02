import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import AppHeader from "@/components/ui/AppHeader";
import { COLORS } from "@/constants/colors";

const RackGrid = () => {
  const router = useRouter();
  const { rack } = useLocalSearchParams();

  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch shelves
  useEffect(() => {
    const fetchShelves = async () => {
      try {
        const response = await fetch(
          `http://10.100.95.54:5000/api/v1/racks/${rack}/shelves`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch shelves");
        }

        const data = await response.json();
        setShelves(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (rack) fetchShelves();
  }, [rack]);

  // 🔹 Group shelves by row letter
  const groupedShelves = useMemo(() => {
    return shelves.reduce((acc, item) => {
      if (!item?.shelf_name) return acc;

      const row = item.shelf_name.charAt(0);

      if (!acc[row]) acc[row] = [];
      acc[row].push(item);

      return acc;
    }, {});
  }, [shelves]);

  // 🔹 Reusable row renderer
  const renderRows = (rows) =>
    rows.map((row) => (
      <View
        key={row}
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        {groupedShelves[row]
          .sort((a, b) =>
            a.shelf_name.localeCompare(b.shelf_name, undefined, {
              numeric: true,
            })
          )
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.box}
              onPress={() =>
                router.push({
                  pathname: `/addItem/${rack}/scan`,
                  params: { shelf: item.shelf_name },
                })
              }
            >
              <Text style={{ color: COLORS.text }}>{item.shelf_name}</Text>
            </TouchableOpacity>
          ))}
      </View>
    ));

  const allRows = Object.keys(groupedShelves).sort(); // All rows

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AppHeader title="Back to Racks" onPress={() => router.back()} />

      <Text style={styles.title}>{rack?.toUpperCase()} Shelves</Text>

      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <View style={{ marginTop: 20 }}>{renderRows(allRows)}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginVertical: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  box: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.primary + "33",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
});

export default RackGrid;
