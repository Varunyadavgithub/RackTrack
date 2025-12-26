import { Text, View } from "react-native";
import { COLORS } from "@/constants/colors.js";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: COLORS.text,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        RackTrack
      </Text>
      <PrimaryButton
        title="Search Item"
        onPress={() => router.push("/search")}
      />
      <PrimaryButton title="Add Items" onPress={() => router.push("/add")} />
              <PrimaryButton title="Remove Items" onPress={() => router.push("/remove")} />
      <PrimaryButton
        title="Rack Overview"
        onPress={() => router.push("/racks")}
      />
    </View>
  );
}
