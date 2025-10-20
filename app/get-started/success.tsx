import img from "@/assets/images/img4.png";
import { useApp } from "@/contexts/AppContext";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const success = () => {
  const { profile } = useApp();

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <ScrollView contentContainerClassName="items-center">
        <Image
          source={img}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
        <Text className="font-poppins-semibold text-3xl text-center">
          You are all set!
        </Text>
        <Text className="mt-6 text-lg px-10 text-center font-poppins-regular text-[#625D5D]">
          You need {profile?.totalCups} refills (
          {profile?.containerSize.toLocaleString()} ml each) to crush your{" "}
          {profile?.totalGoals.toLocaleString()} ml goal — and don’t worry,
          we’ll ping you when it’s sip time!
        </Text>
      </ScrollView>

      <View className="px-4 w-full">
        <TouchableOpacity
          onPress={() => router.replace("/dashboard")}
          activeOpacity={0.7}
          className="bg-[#5DCCFC] p-4 items-center justify-center rounded-xl"
        >
          <Text className="text-lg text-white font-poppins-bold">
            Go to dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default success;
