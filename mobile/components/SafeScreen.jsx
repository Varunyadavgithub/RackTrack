import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors.js";

const SafeScreen = ({ children }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;
