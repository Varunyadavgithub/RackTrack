import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/colors.js";
import { Ionicons } from "@expo/vector-icons";

const AppHeader = ({ title, onPress }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onPress) {
      onPress();
    } else {
      router.replace("/");
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.background,
      }}
    >
      <Pressable onPress={handleBack} style={{ flexDirection: "row", gap: 6 }}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        <Text
          style={{
            marginLeft: 12,
            fontSize: 18,
            fontWeight: "600",
            color: COLORS.text,
          }}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

export default AppHeader;
