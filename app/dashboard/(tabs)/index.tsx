import WaterCup from "@/components/custom/GlassWater";
import WaterRain from "@/components/custom/WaterRain";
import DrinkPortalBurst from "@/components/home/Burse";
import Stats from "@/components/home/Stats";
import { useDashboard } from "@/contexts/DashboardContext";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

const index = () => {
  const { hydrationData, addIntake } = useDashboard();
  const [rainTrigger, setRainTrigger] = useState(0);

  const progress =
    hydrationData && hydrationData.totalGoal
      ? hydrationData.totalDrank / hydrationData.totalGoal
      : 0;

  const handleDrink = () => {
    addIntake();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRainTrigger((prev) => prev + 1);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className=" px-4 mt-14">
      <WaterRain trigger={rainTrigger} />

      <View>
        <Text className="font-poppins-regular text-gray-500">Hi there,</Text>
        <Text className="text-4xl font-poppins-black mt-2">Good morning!</Text>
      </View>
      <View className="mt-10">
        <Text className="font-poppins-regular text-[#0c81b7] text-lg text-center mb-2">
          {progress === 0
            ? "Let's get started! Take your first sip."
            : progress < 0.3
              ? "Nice start! Keep drinking steadily."
              : progress < 0.6
                ? "You’re halfway there, great job!"
                : progress < 0.9
                  ? "Almost there! Just a bit more."
                  : progress < 1
                    ? "Finish strong — one last drink!"
                    : "Goal achieved! Stay hydrated and proud!"}
        </Text>

        <WaterCup
          waterLevel={progress * 100}
          volume={hydrationData?.totalDrank}
          size={200}
        />
      </View>

      <View className="mt-4">
        <DrinkPortalBurst onDrink={() => handleDrink()} />
      </View>
      <Stats />
    </ScrollView>
  );
};

export default index;
