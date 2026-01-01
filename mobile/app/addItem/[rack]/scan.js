import { View, Text, StyleSheet, Button } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CameraView, CameraFacing, useCameraPermissions } from "expo-camera";

export default function ScanShelf() {
  const router = useRouter();
  const { rack, shelf } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  // Ask for camera permission
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Handle barcode scan
  const handleBarcodeScanned = ({ data, type }) => {
    setScanned(true);
    setBarcodeData(data);

    alert(
      `✅ Barcode Scanned\n\nRack: ${rack}\nShelf: ${shelf}\nCode: ${data}`
    );
  };

  // Permission loading
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Camera Scanner */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Bottom Actions */}
      {scanned && (
        <View style={styles.actions}>
          <Text style={styles.resultText}>Scanned: {barcodeData}</Text>

          <Button title="Scan Again" onPress={() => setScanned(false)} />
          <Button
            title="Back to Racks"
            onPress={() => router.replace("/addItem")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
