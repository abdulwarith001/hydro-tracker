import OverallStats from "@/components/OverallStats";
import WeeklyStats from "@/components/WeeklyStats";
import eventEmitter from "@/services/event";
import { getLast7DaysHydrationData } from "@/services/stats";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

const Analysis = () => {
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    const result = await getLast7DaysHydrationData();
    setData(result);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  }, [fetch]);

  useEffect(() => {
    fetch();

    eventEmitter.on("drinkTaken", fetch);
    return () => {
      eventEmitter.removeListener("drinkTaken", fetch);
    };
  }, [fetch]);

  return (
    <View className="px-4 bg-white flex-1 mt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WeeklyStats data={data} />
        <OverallStats />
      </ScrollView>
    </View>
  );
};

export default Analysis;
