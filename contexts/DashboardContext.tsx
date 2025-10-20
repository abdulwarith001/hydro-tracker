import { scheduleHydrationReminders } from "@/services/scheduleNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useApp } from "./AppContext";

interface IntakeEvent {
  time: string; // ISO string
  amount: number;
}

interface HydrationDayData {
  date: string; // YYYY-MM-DD
  totalGoal: number;
  containerSize: number;
  intakeEvents: IntakeEvent[];
  totalDrank: number;
}

interface DashboardContextType {
  hydrationData: HydrationDayData | null;
  addIntake: () => Promise<void>;
  resetToday: (data: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { profile, logout } = useApp();
  const [hydrationData, setHydrationData] = useState<HydrationDayData | null>(
    null
  );

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const init = async () => {
    if (!profile) {
      await AsyncStorage.removeItem(`hydration_${today}`);
      logout();
      router.replace("/");
      return;
    }

    const existing = await AsyncStorage.getItem(`hydration_${today}`);
    const reminders = await AsyncStorage.getItem(`reminders_scheduled`);
    if (!reminders) {
      await Promise.all([
        scheduleHydrationReminders(),
        AsyncStorage.setItem(`reminders_scheduled`, "true"),
      ]);
    }

    if (existing) {
      setHydrationData(JSON.parse(existing));
    } else {
      const newData: HydrationDayData = {
        date: today,
        totalGoal: profile.totalGoals || 0,
        containerSize: profile.containerSize || 0,
        intakeEvents: [],
        totalDrank: 0,
      };
      await AsyncStorage.setItem(`hydration_${today}`, JSON.stringify(newData));
      setHydrationData(newData);
    }
  };
  const addIntake = async () => {
    if (!hydrationData) return;

    const updated: HydrationDayData = {
      ...hydrationData,
      totalDrank:
        Number(hydrationData.totalDrank) + Number(hydrationData.containerSize),
      intakeEvents: [
        ...hydrationData.intakeEvents,
        { time: new Date().toISOString(), amount: hydrationData.containerSize },
      ],
    };

    await AsyncStorage.setItem(`hydration_${today}`, JSON.stringify(updated));
    setHydrationData(updated);
  };

  // Update the resetToday function to reschedule
  const resetToday = async (formValues: any) => {
    const newData: HydrationDayData = {
      date: today,
      totalGoal: formValues?.totalGoals || 2000,
      containerSize: formValues?.containerSize || 250,
      intakeEvents: [],
      totalDrank: 0,
    };

    await AsyncStorage.setItem(`hydration_${today}`, JSON.stringify(newData));
    const reminders = await AsyncStorage.getItem(`reminders_scheduled`);
    if (!reminders) {
      await Promise.all([
        scheduleHydrationReminders(),
        AsyncStorage.setItem(`reminders_scheduled`, "true"),
      ]);
    }
    setHydrationData(newData);
  };

  const refreshData = async () => {
    const existing = await AsyncStorage.getItem(`hydration_${today}`);
    if (existing) setHydrationData(JSON.parse(existing));
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <DashboardContext.Provider
      value={{ hydrationData, addIntake, resetToday, refreshData }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used within DashboardProvider");
  return context;
};
