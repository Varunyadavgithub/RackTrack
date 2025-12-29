import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeScreen>
      </PersistGate>
    </Provider>
  );
}
