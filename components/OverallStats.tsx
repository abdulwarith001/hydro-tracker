import { useApp } from "@/contexts/AppContext";
import { useDashboard } from "@/contexts/DashboardContext";
import eventEmitter from "@/services/event";
import { getLast7DaysHydrationData } from "@/services/stats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const OverallStats = () => {
  const { profile } = useApp();
  const { hydrationData } = useDashboard();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      const weekData = await getLast7DaysHydrationData();
      const values = weekData.datasets[0].data;
      const labels = weekData.labels;

      // Week totals
      const totalWeek = values.reduce((a, b) => a + b, 0);
      const avgDaily = totalWeek / values.length;

      // Previous week for comparison
      const prevWeekStart = -14;
      const prevWeekEnd = -7;
      let totalPrevWeek = 0;

      for (let i = prevWeekStart; i <= prevWeekEnd; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const data = await AsyncStorage.getItem(`hydration_${dateStr}`);
        if (data) {
          const parsed = JSON.parse(data);
          totalPrevWeek += parsed.totalDrank || 0;
        }
      }

      const weekChange =
        totalPrevWeek > 0
          ? ((totalWeek - totalPrevWeek) / totalPrevWeek) * 100
          : 0;

      // Most active day
      const maxVal = Math.max(...values);
      const maxDay = labels[values.indexOf(maxVal)];

      // Get yesterday's data
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const yesterdayData = await AsyncStorage.getItem(
        `hydration_${yesterdayStr}`
      );
      const yesterdayTotal = yesterdayData
        ? JSON.parse(yesterdayData).totalDrank || 0
        : 0;

      // Calculate lifetime volume from all stored data
      const lifetimeVolume = await calculateLifetimeVolume();

      // Calculate streak
      const streak = await calculateStreak();

      setStats({
        totalWeek,
        avgDaily,
        mostActiveDay: maxDay,
        mostActiveValue: maxVal,
        weekChange,
        currentStreak: streak.current,
        longestStreak: streak.longest,
        yesterdayTotal,
        lifetimeVolume,
      });
    };
    loadStats();

    eventEmitter.on("drinkTaken", loadStats);
    return () => {
      eventEmitter.removeListener("drinkTaken", loadStats);
    };
  }, [profile]);

  const calculateLifetimeVolume = async () => {
    let total = 0;
    let totalRefills = 0;

    // Get all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const hydrationKeys = keys.filter((key) => key.startsWith("hydration_"));

    // Get all hydration data
    const hydrationEntries = await AsyncStorage.multiGet(hydrationKeys);

    hydrationEntries.forEach(([key, value]) => {
      if (value) {
        const data = JSON.parse(value);
        total += data.totalDrank || 0;
        totalRefills += data.intakeEvents?.length || 0;
      }
    });

    return { volume: total, refills: totalRefills };
  };

  const calculateStreak = async () => {
    const dailyGoal = profile?.totalGoals || 2000;
    let current = 0;
    let longest = 0;
    let temp = 0;

    // Check last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const data = await AsyncStorage.getItem(`hydration_${dateStr}`);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.totalDrank >= dailyGoal) {
          temp++;
          if (i === 0 || temp === current + 1) current = temp;
        } else {
          if (temp > longest) longest = temp;
          temp = 0;
        }
      } else {
        if (temp > longest) longest = temp;
        temp = 0;
      }
    }

    return { current, longest: Math.max(longest, temp, current) };
  };

  const getTrendIcon = (change: number) => {
    if (change > 10) return "📈";
    if (change > 0) return "↗️";
    if (change === 0) return "→";
    if (change > -10) return "↘️";
    return "📉";
  };

  return (
    <View className="mt-12">
      {/* Grid Layout - 2 columns */}
      <View className="flex-row flex-wrap gap-4">
        {/* Row 1 - Current Streak (tall) + Best Streak */}
        <View className="w-[48%] gap-4">
          <StatCard
            title="🔥 Current Streak"
            value={`${stats?.currentStreak || 0} days`}
            highlight
            full
            tall
          />
        </View>
        <View className="w-[48%] gap-4">
          <StatCard
            title="🏆 Best Streak"
            value={`${stats?.longestStreak || 0} days`}
            full
          />

          <StatCard
            title="This Week"
            value={`${stats?.totalWeek || 0}ml`}
            full
          />
        </View>

        {/* Row 2 - Daily Average */}
        <StatCard
          title="Daily Average"
          value={`${Math.round(stats?.avgDaily || 0)}ml`}
        />

        {/* Row 3 - Activity Stats */}
        <StatCard
          title="Most Active Day"
          value={`${stats?.mostActiveDay || "--"}`}
          subValue={`${stats?.mostActiveValue || 0}ml`}
        />

        {/* Row 4 - Lifetime Stats */}
        <StatCard
          title="Lifetime Volume"
          value={`${((stats?.lifetimeVolume?.volume || 0) / 1000).toFixed(1)}L`}
        />
        <StatCard
          title="Total Refills"
          value={`${stats?.lifetimeVolume?.refills || 0}`}
        />
      </View>
    </View>
  );
};

const StatCard = ({
  title,
  value,
  subValue,
  highlight,
  tall,
  full,
}: {
  title: string;
  value: string | number;
  subValue?: string | number;
  highlight?: boolean;
  tall?: boolean;
  full?: boolean;
}) => (
  <View
    className={`border p-4 items-start justify-between rounded-2xl ${tall ? "w-full h-[200px]" : full ? "w-full" : "w-[48%]"} ${
      highlight ? "bg-orange-50 border-orange-300" : "border-[#D0DBE2] bg-white"
    }`}
  >
    <Text
      className={`font-poppins-regular ${
        highlight ? "text-orange-900" : "text-black"
      }`}
    >
      {title}
    </Text>
    <View>
      <Text
        className={`font-poppins-bold text-2xl mt-2 ${
          highlight ? "text-orange-600" : "text-black"
        }`}
      >
        {value}
      </Text>
      {subValue && (
        <Text className="font-poppins-regular text-gray-500 text-sm">
          {subValue}
        </Text>
      )}
    </View>
  </View>
);

export default OverallStats;
