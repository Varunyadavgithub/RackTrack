import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AppHeader from "@/components/ui/AppHeader";
import { COLORS } from "@/constants/colors";

const RackGrid = () => {
  const router = useRouter();
  const { rack } = useLocalSearchParams();

  const rows = ["A", "B", "C"];
  const cols = [1, 2, 3];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AppHeader title="Back to Racks" />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: COLORS.text,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        {rack.toUpperCase()} Shelves
      </Text>

      <View style={{ marginTop: 20 }}>
        {rows.map((row) => (
          <View
            key={row}
            style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}
          >
            {cols.map((col) => {
              const shelf = `${row}${col}`;
              return (
                <TouchableOpacity
                  key={shelf}
                  style={styles.box}
                  onPress={() =>
                    router.push({
                      pathname: `/addItem/${rack}/scan`,
                      params: { shelf },
                    })
                  }
                >
                  <Text style={{ color: COLORS.text }}>{shelf}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
