import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { COLORS } from "@/constants/colors";

export default function AddFromScan() {
  const router = useRouter();
  const { rack, shelf, sapCode, material } = useLocalSearchParams();
  const parsedMaterial = JSON.parse(material);

  const [quantity, setQuantity] = useState("");
  const [hasPallet, setHasPallet] = useState(null);
  const [loading, setLoading] = useState(false); // <-- loader state

  const handleSave = async () => {
    if (!quantity) {
      alert("Please enter quantity");
      return;
    }

    if (hasPallet === null) {
      alert("Please choose whether this material has a wooden pallet");
      return;
    }

    const payload = {
      rackName: rack,
      shelfName: shelf,
      sapCode: sapCode,
      materialName: parsedMaterial.material_name,
      materialDescription: parsedMaterial.material_description,
      materialWeight: parsedMaterial.material_weight,
      materialType: parsedMaterial.material_type,
      woodenPalletWeight: hasPallet ? 2 : 0,
      quantity: Number(quantity),
    };

    try {
      setLoading(true); // <-- show loader
      const response = await fetch(
        "http://10.100.95.54:5000/api/v1/rack-items",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Response not JSON:", text);
        throw new Error(
          "Server did not return JSON. Check backend URL or server status."
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to save material");
      }

      alert(`Material saved successfully: ${data.material_name}`);
      router.replace("/addMaterial");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false); // <-- hide loader
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Material to Rack</Text>

      {/* Rack & Shelf Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rack Details</Text>
        <Text style={styles.row}>Rack: {rack}</Text>
        <Text style={styles.row}>Shelf: {shelf}</Text>
        <Text style={styles.row}>SAP Code: {sapCode}</Text>
      </View>

      {/* Material Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Material Info</Text>
        <Text style={styles.materialName}>{parsedMaterial.material_name}</Text>
        <Text style={styles.materialDesc}>
          {parsedMaterial.material_description}
        </Text>
        <Text style={styles.materialMeta}>
          Weight: {parsedMaterial.material_weight} kg | Type:{" "}
          {parsedMaterial.material_type}
        </Text>
      </View>

      {/* Quantity Input */}
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        placeholderTextColor={COLORS.textLight}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {/* Wooden Pallet Yes/No */}
      <View style={styles.palletRow}>
        <Text style={styles.label}>
          Does this Material have a wooden pallet?
        </Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, hasPallet === true && styles.buttonSelected]}
            onPress={() => setHasPallet(true)}
          >
            <Text
              style={[
                styles.buttonText,
                hasPallet === true && styles.buttonTextSelected,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              hasPallet === false && styles.buttonSelected,
            ]}
            onPress={() => setHasPallet(false)}
          >
            <Text
              style={[
                styles.buttonText,
                hasPallet === false && styles.buttonTextSelected,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loader or Button */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginVertical: 20 }}
        />
      ) : (
        <PrimaryButton title="Save Material" onPress={handleSave} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  row: { fontSize: 14, color: COLORS.text, marginBottom: 4 },
  materialName: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  materialDesc: { color: COLORS.text, marginBottom: 6 },
  materialMeta: { color: COLORS.textLight, fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    color: COLORS.text,
  },
  palletRow: { marginBottom: 20 },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonsRow: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSelected: { backgroundColor: COLORS.primary },
  buttonText: { color: COLORS.primary, fontWeight: "bold" },
  buttonTextSelected: { color: COLORS.white },
});
