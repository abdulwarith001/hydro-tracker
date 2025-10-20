// components/WaterRain.tsx
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function WaterRain({ trigger }: { trigger: number }) {
  const [drops, setDrops] = useState<number[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const count = 100;
      setDrops(Array.from({ length: count }, (_, i) => i));
      const timer = setTimeout(() => setDrops([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {drops.map((i) => {
        const startX = Math.random() * width;
        const dropSize = 4 + Math.random() * 8;
        const duration = 2000 + Math.random() * 1000;
        const delay = Math.random() * 400;

        return (
          <MotiView
            key={i}
            from={{
              translateY: -100 - Math.random() * 100, // start above screen top
              opacity: 0.8,
              scale: 0.8,
            }}
            animate={{
              translateY: height + 50, // fall beyond screen bottom
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration, delay }}
            style={{
              position: "absolute",
              top: 0,
              left: startX,
              width: dropSize,
              height: dropSize * 2,
              borderRadius: dropSize,
              backgroundColor: "#5DCCFC",
              opacity: 0.85,
            }}
          />
        );
      })}
    </View>
  );
}
