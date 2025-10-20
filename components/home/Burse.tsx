import eventEmitter from "@/services/event";
import { AnimatePresence, MotiView } from "moti";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const DrinkPortalBurst = ({ onDrink }: { onDrink: () => void }) => {
  const [burst, setBurst] = useState(false);

  const trigger = () => {
    setBurst(true);
    onDrink?.();
    setTimeout(() => setBurst(false), 1500);
    eventEmitter.emit("drinkTaken");
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        onPress={trigger}
        activeOpacity={0.7}
        className="bg-[#00b4d8] p-5 px-16 rounded-full overflow-hidden"
      >
        <Text className="text-white text-xl font-poppins-bold">
          Take a drink
        </Text>
      </TouchableOpacity>

      <AnimatePresence>
        {burst && (
          <>
            {/* Portal Glow */}
            <MotiView
              from={{ scale: 0, opacity: 1 }}
              animate={{ scale: 10, opacity: 0 }}
              transition={{
                type: "timing",
                duration: 800,
                easing: Easing.out(Easing.ease),
              }}
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: 9999,
                backgroundColor: "#5DCCFC55",
                top: height / 2 - 40,
                left: width / 2 - 40,
              }}
            />

            {/* Hydration Pulse */}
            <MotiView
              from={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 12, opacity: 0 }}
              transition={{
                type: "timing",
                duration: 1000,
                easing: Easing.out(Easing.quad),
              }}
              style={{
                position: "absolute",
                top: height / 2 - 40,
                left: width / 2 - 40,
                width: 80,
                height: 80,
                borderRadius: 9999,
                backgroundColor: "#48CAE455",
              }}
            />

            {/* Falling Droplets */}
            {Array.from({ length: 30 }).map((_, i) => {
              const startX = width / 2 + (Math.random() - 0.5) * 120;
              const endX = startX + (Math.random() - 0.5) * 100;
              const delay = Math.random() * 200;
              const duration = 1200 + Math.random() * 400;

              return (
                <MotiView
                  key={i}
                  from={{
                    translateY: -100,
                    translateX: startX,
                    opacity: 1,
                    scale: 0,
                  }}
                  animate={{
                    translateY: height,
                    translateX: endX,
                    opacity: 0,
                    scale: 1,
                  }}
                  transition={{ type: "timing", duration, delay }}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: i % 2 ? "#90E0EF" : "#CAF0F8",
                  }}
                />
              );
            })}

            {/* Floating "+10ml" Text */}
            <MotiView
              from={{ translateY: 0, opacity: 1 }}
              animate={{ translateY: -100, opacity: 0 }}
              transition={{
                type: "timing",
                duration: 1200,
                easing: Easing.out(Easing.exp),
              }}
              style={{
                position: "absolute",
                top: height / 2 - 120,
                left: width / 2 - 40,
              }}
            >
              <Text className="text-2xl font-poppins-bold text-[#00b4d8]">
                +10ml 💧
              </Text>
            </MotiView>
          </>
        )}
      </AnimatePresence>
    </View>
  );
};

export default DrinkPortalBurst;
