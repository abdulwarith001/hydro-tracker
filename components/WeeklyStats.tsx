import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

export default function WeeklyStats({ data }: any) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 180, 216, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6,
  };

  return (
    <View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-poppins-black text-lg">Weekly stats</Text>

        <TouchableOpacity
          className="bg-[#00b4d8]/10 px-3 py-1 rounded-full"
          onPress={() => setChartType(chartType === "line" ? "bar" : "line")}
        >
          <Text className="text-[rgb(0,180,216)] font-poppins-semibold text-sm">
            {chartType === "line" ? "Bar View" : "Line View"}
          </Text>
        </TouchableOpacity>
      </View>

      {data &&
        (chartType === "line" ? (
          <LineChart
            data={data}
            width={screenWidth - 16}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
              alignSelf: "center",
              marginLeft: -10,
            }}
            formatYLabel={(value) => {
              const num = parseInt(value, 10);
              return num >= 1000
                ? `${(num / 1000).toFixed(1)}k`
                : num.toString();
            }}
          />
        ) : (
          <BarChart
            data={data}
            width={screenWidth - 16}
            height={200}
            chartConfig={chartConfig}
            style={{
              borderRadius: 16,
              alignSelf: "center",
              marginLeft: -10,
            }}
            yAxisLabel={""}
            yAxisSuffix={""}
            fromZero
          />
        ))}
    </View>
  );
}
