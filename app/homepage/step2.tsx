import arr from "@/assets/icons/arrow-left.png";
import img from "@/assets/images/img2.png";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Step2() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity onPress={() => router.back()} className="px-4">
        <Image source={arr} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>
      <ScrollView className="mt-10">
        <View className="items-center">
          <Image source={img} style={{ width: 300, height: 300 }} />
          <Text className="font-poppins-semibold text-3xl px-10 mt-8 text-center">
            Smart Reminders Tailored to You
          </Text>
          <Text className="mt-6 text-lg px-10 text-center font-poppins-regular text-[#625D5D]">
            Quick and easy to set your hydration goal & then track your daily
            water intake progress.
          </Text>
        </View>

        <View className="items-center mt-20 flex-row gap-2 justify-center">
          <View className="h-2 w-8 rounded-full bg-[#F2F2F2]" />
          <View className="h-2 w-8 rounded-full bg-[#5DCCFC]" />
          <View className="h-2 w-8 rounded-full bg-[#F2F2F2]" />
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push("/homepage/step3")}
        className="mx-6 bg-[#5DCCFC] p-4 items-center justify-center rounded-xl"
      >
        <Text className="text-lg text-white font-poppins-bold">NEXT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
