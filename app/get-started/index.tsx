import CustomSelect from "@/components/ui/Select";
import CustomInput from "@/components/ui/TextInput";
import { useApp } from "@/contexts/AppContext";
import { useHydration } from "@/contexts/CreateHydration";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStarted = () => {
  const { formValues, updateField, errors, validateAll } = useHydration();
  const { login } = useApp();

  const handleSubmit = async () => {
    const hasNoError = validateAll();
    if (hasNoError) {
      await login(formValues);
      router.push("/get-started/success");
    }
  };
  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-start mt-2">
          <Text className="font-poppins-semibold text-3xl">
            Let's start crushing your Hydration Goals
          </Text>
        </View>

        <View className="mt-6 space-y-4">
          <CustomInput
            label="Intake Goal (Per day)"
            keyboardType="number-pad"
            variant="tertiary"
            helperText="Enter your total daily goal, e.g. 2000 ml"
            error={errors.totalGoals}
            value={formValues.totalGoals}
            onChangeText={(val) => updateField("totalGoals", val)}
          />

          <CustomSelect
            label="Select your water container size"
            modalTitle="Choose your container"
            variant="tertiary"
            placeholder=""
            error={errors.containerSize}
            value={formValues.containerSize}
            onSelectionChange={(val) => updateField("containerSize", val.value)}
            options={[
              { label: "Water Bottle (500ml)", value: "500" },
              { label: "Large Bottle (1000ml)", value: "1000" },
              { label: "Cup (250ml)", value: "250" },
              { label: "Glass (300ml)", value: "300" },
              { label: "Hydro Flask (750ml)", value: "750" },
              { label: "Jug (2000ml)", value: "2000" },
            ]}
          />

          {/* --- Minimal Personalization Hooks --- */}

          <CustomSelect
            label="Wake Time"
            modalTitle="When do you usually wake up?"
            variant="tertiary"
            helperText="e.g. 6:00 AM"
            error={errors.wake}
            value={formValues.wake}
            placeholder=""
            onSelectionChange={(val) => updateField("wake", val.value)}
            options={[
              { label: "5:00 AM", value: "05:00" },
              { label: "6:00 AM", value: "06:00" },
              { label: "7:00 AM", value: "07:00" },
              { label: "8:00 AM", value: "08:00" },
            ]}
          />

          <CustomSelect
            label="Sleep Time"
            modalTitle="When do you usually sleep?"
            variant="tertiary"
            helperText="e.g. 10:00 PM"
            error={errors.sleep}
            value={formValues.sleep}
            placeholder=""
            onSelectionChange={(val) => updateField("sleep", val.value)}
            options={[
              { label: "9:00 PM", value: "21:00" },
              { label: "10:00 PM", value: "22:00" },
              { label: "11:00 PM", value: "23:00" },
              { label: "12:00 AM", value: "00:00" },
            ]}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => handleSubmit()}
        activeOpacity={0.7}
        className="bg-[#5DCCFC] p-4 items-center justify-center rounded-xl"
      >
        <Text className="text-lg text-white font-poppins-bold">SAVE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GetStarted;
