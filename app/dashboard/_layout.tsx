import { DashboardProvider } from "@/contexts/DashboardContext";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <DashboardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DashboardProvider>
  );
};

export default _layout;
