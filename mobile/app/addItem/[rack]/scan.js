import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScanShelf() {
  const router = useRouter();
  const { rack, shelf } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ask permission
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);

    try {
      // 🔗 FETCH MATERIAL BY SAP CODE
      const res = await fetch(`http://10.100.95.54:5000/api/v1/materials/${data}`);
      const material = await res.json();

      if (!material) {
        alert("Material not found");
        setScanned(false);
        return;
      }

      // 👉 Navigate to Add Item Form with fetched data
      router.push({
        pathname: "/addItem/addFromScan",
        params: {
          rack,
          shelf,
          sapCode: data,
          material: JSON.stringify(material),
        },
      });
    } catch (err) {
      alert("Failed to fetch material");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No camera access</Text>;

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
