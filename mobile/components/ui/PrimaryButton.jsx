import { Pressable, Text } from "react-native";
import { COLORS } from "@/constants/colors.js";

const PrimaryButton = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "600" }}>
        {title}
      </Text>
    </Pressable>
  );
};

export default PrimaryButton;
