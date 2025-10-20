import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getLast7DaysHydrationData() {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = `hydration_${date.toISOString().split("T")[0]}`;
    days.push(key);
  }

  const results = await Promise.all(days.map((k) => AsyncStorage.getItem(k)));

  const labels: string[] = [];
  const data: number[] = [];

  results.forEach((item, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));

    if (item) {
      const parsed = JSON.parse(item);
      data.push(parsed.totalDrank || 0);
    } else {
      data.push(0);
    }
  });

  return {
    labels,
    datasets: [{ data }],
  };
}
