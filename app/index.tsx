import { useApp } from "@/contexts/AppContext";
import { Redirect } from "expo-router";
import React from "react";
import { Text } from "react-native";

const index = () => {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) return <Text>Loading...</Text>;
  return isAuthenticated ? (
    <Redirect href="/dashboard" />
  ) : (
    <Redirect href="/homepage" />
  );
};

export default index;
