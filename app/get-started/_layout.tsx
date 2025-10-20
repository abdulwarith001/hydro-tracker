import { HydrationProvider } from "@/contexts/CreateHydration";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <HydrationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HydrationProvider>
  );
};

export default _layout;
