import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { COLORS } from "@/constants/colors";

export default function ScanShelf() {
  const router = useRouter();
  const { rack, shelf } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sapCode, setSapCode] = useState("");

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const fetchMaterial = async (code) => {
    setLoading(true);
    setScanned(true);

    try {
      const res = await fetch(
        `http://10.100.95.54:5000/api/v1/materials/${code}`
      );

      if (!res.ok) throw new Error("Material not found");

      const material = await res.json();

      router.push({
        pathname: "/addMaterial/addFromScan",
        params: {
          rack,
          shelf,
          sapCode: code,
          material: JSON.stringify(material),
        },
      });
    } catch (err) {
      Alert.alert("Error", err.message);
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (!data) return;
    fetchMaterial(data);
  };

  const handleManualSearch = () => {
    if (!sapCode.trim()) {
      Alert.alert("Validation", "Enter SAP Code");
      return;
    }
    fetchMaterial(sapCode.trim());
  };

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No camera access</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Camera */}
        <View style={{ flex: 1 }}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />
        </View>

        {/* Manual Entry Section */}
        <View style={styles.manualContainer}>
          <Text style={styles.manualTitle}>QR not scanning?</Text>

          <TextInput
            placeholder="Enter SAP Code manually"
            value={sapCode}
            onChangeText={setSapCode}
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <PrimaryButton
            title={loading ? "Fetching..." : "Fetch Material"}
            onPress={handleManualSearch}
            disabled={loading}
          />
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  manualContainer: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  manualTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    color: COLORS.text,
  },
});
