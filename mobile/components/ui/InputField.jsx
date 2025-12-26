import { TextInput } from "react-native";
import { COLORS } from "@/constants/colors.js";

const InputField = ({ placeholder, value, onChangeText }) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={COLORS.textLight}
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
        color: COLORS.text,
        backgroundColor: COLORS.white,
      }}
    ></TextInput>
  );
};

export default InputField;
