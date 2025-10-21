import { useApp } from "@/contexts/AppContext";
import { Redirect } from "expo-router";
import React from "react";
import Homepage from "./homepage";

const index = () => {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) return <Homepage />;
  return isAuthenticated ? (
    <Redirect href="/dashboard" />
  ) : (
    <Redirect href="/homepage" />
  );
};

export default index;
