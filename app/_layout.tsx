import { AppProvider } from "@/contexts/AppContext";
import { registerForPushNotificationsAsync } from "@/services/notifications";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    PoppinsBlack: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    Inter: require("../assets/fonts/Inter/static/Inter_18pt-Black.ttf"),
  });

  React.useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationReceivedListener(
      () => {}
    );

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AppProvider>
      <StatusBar barStyle={"dark-content"} />
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
