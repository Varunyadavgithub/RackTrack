import { Text, View, Image, StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/colors";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={require("@/assets/images/hero-image.png")}
          style={styles.heroImage}
        />

        <Text style={styles.title}>RackTrack</Text>
        <Text style={styles.subtitle}>
          Track, organize, and manage your racks effortlessly
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="Search Materials"
          onPress={() => router.push("/searchMaterial")}
        />
        <PrimaryButton
          title="Add Materials"
          onPress={() => router.push("/addMaterial")}
        />
        <PrimaryButton
          title="Remove Materials"
          onPress={() => router.push("/removeMaterial")}
        />
        <PrimaryButton
          title="Rack Overview"
          onPress={() => router.push("/rackOverview")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },

  hero: {
    alignItems: "center",
  },

  heroImage: {
    width: width * 0.9,
    height: height * 0.35,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.mutedText || "#777",
    textAlign: "center",
    marginTop: 8,
  },

  actions: {
    gap: 5,
  },
});
