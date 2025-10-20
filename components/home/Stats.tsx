import { useApp } from "@/contexts/AppContext";
import { useDashboard } from "@/contexts/DashboardContext";
import React from "react";
import { Text, View } from "react-native";

const Stats = () => {
  const { profile } = useApp();
  const { hydrationData } = useDashboard();
  return (
    <View>
      <View className="mt-8 flex-row items-center justify-between gap-4">
        <View className="border border-[#D0DBE2] p-4 gap-10 w-[48%] rounded-2xl">
          <Text className="font-poppins-regular text-black">Total Volume</Text>
          <Text className="font-poppins-bold text-4xl">
            {hydrationData?.totalGoal}ml
          </Text>
        </View>

        <View className="border border-[#D0DBE2] p-4 gap-10 w-[48%] rounded-2xl">
          <Text className="font-poppins-regular text-black">
            Current Volume
          </Text>
          <Text className="font-poppins-bold text-4xl">
            {hydrationData?.totalDrank}ml
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between gap-4">
        <View className="border border-[#D0DBE2] p-4 gap-10 w-[48%] rounded-2xl">
          <Text className="font-poppins-regular text-black">
            Container size
          </Text>
          <Text className="font-poppins-bold text-4xl">
            {hydrationData?.containerSize}ml
          </Text>
        </View>

        <View className="border border-[#D0DBE2] p-4 gap-10 w-[48%] rounded-2xl">
          <Text className="font-poppins-regular text-black">Total refills</Text>
          <Text className="font-poppins-bold text-4xl">
            {profile?.totalCups} refills
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Stats;
