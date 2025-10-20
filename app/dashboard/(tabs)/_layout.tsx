import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const _layout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5DCCFC",
        tabBarStyle:
          Platform.OS === "android"
            ? {
                height: 60 + insets.bottom,
                paddingBottom: insets.bottom + 10,
              }
            : {},
        tabBarLabelStyle: {
          fontFamily: "PoppinsSemiBold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: { backgroundColor: "white" },
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          sceneStyle: { backgroundColor: "white" },
          title: "Analysis",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="google-analytics"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          sceneStyle: { backgroundColor: "white" },
          title: "My Profile",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name="user-o" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
