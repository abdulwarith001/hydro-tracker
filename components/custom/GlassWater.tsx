import { Accelerometer } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

interface WaterCupProps {
  waterLevel: number; // 0–100
  waterColor?: string;
  lightWaterColor?: string;
  size?: number;
  volume?: number; // ml
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function WaterCup({
  waterLevel = 50,
  waterColor = "#4FC3F7",
  lightWaterColor = "#81D4FA",
  size = 300,
  volume = 500,
}: WaterCupProps): React.ReactElement {
  const animatedLevel = useRef(new Animated.Value(waterLevel)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const splashAnim = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeIntensity = useRef(new Animated.Value(0)).current;
  const surfaceTilt = useRef(new Animated.Value(0)).current;
  const turbulence = useRef(new Animated.Value(0)).current;
  const [isShaking, setIsShaking] = useState(false);
  const [lastX, setLastX] = useState(0);

  // Animate level
  useEffect(() => {
    splashAnim.setValue(0);
    Animated.timing(splashAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.spring(animatedLevel, {
      toValue: waterLevel,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [waterLevel]);

  // Wave loop
  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  // Tilt + shake
  useEffect(() => {
    let subscription: any;
    Accelerometer.setUpdateInterval(16);

    subscription = Accelerometer.addListener(({ x }) => {
      const velocity = Math.abs(x - lastX);
      setLastX(x);

      const tiltAmount = x * -40;
      const rotationAngle = x * -30;

      Animated.spring(shakeX, {
        toValue: tiltAmount,
        friction: 6,
        tension: 30,
        useNativeDriver: false,
      }).start();

      Animated.spring(surfaceTilt, {
        toValue: rotationAngle,
        friction: 7,
        tension: 35,
        useNativeDriver: false,
      }).start();

      const tiltIntensity = Math.min(Math.abs(x) * 3 + velocity * 10, 2);

      if (Math.abs(x) > 0.2 || velocity > 0.05) {
        setIsShaking(true);

        Animated.spring(turbulence, {
          toValue: velocity * 50,
          friction: 5,
          tension: 20,
          useNativeDriver: false,
        }).start();

        Animated.spring(shakeIntensity, {
          toValue: tiltIntensity,
          friction: 6,
          tension: 25,
          useNativeDriver: false,
        }).start();

        if (Math.abs(x) > 0.4 || velocity > 0.1) {
          splashAnim.setValue(0);
          Animated.timing(splashAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }).start();
        }
      } else {
        setIsShaking(false);
        Animated.parallel([
          Animated.spring(shakeIntensity, {
            toValue: 0,
            friction: 7,
            tension: 20,
            useNativeDriver: false,
          }),
          Animated.spring(turbulence, {
            toValue: 0,
            friction: 8,
            tension: 25,
            useNativeDriver: false,
          }),
        ]).start();
      }
    });

    return () => subscription && subscription.remove();
  }, [lastX]);

  const level = Math.max(0, Math.min(100, waterLevel));
  const radius = size / 2;
  const center = size / 2;

  const waterStartY = animatedLevel.interpolate({
    inputRange: [0, 100],
    outputRange: [size, 0],
  });

  const waveOffset = waveAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 8, -3, 10, 0],
  });

  const enhancedWaveOffset = Animated.add(
    Animated.add(waveOffset, Animated.multiply(shakeIntensity, 25)),
    turbulence
  );

  const secondaryWaveOffset = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [5, -5, 5],
  });

  const splashScale = splashAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1.4],
  });

  const splashOpacity = splashAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.4, 0],
  });

  const waveY1 = Animated.add(waterStartY, enhancedWaveOffset);
  const waveY2 = Animated.add(
    Animated.add(waterStartY, Animated.multiply(enhancedWaveOffset, 0.6)),
    secondaryWaveOffset
  );

  const currentVolume = Math.round((volume * level) / 100);

  return (
    <View style={styles.container}>
      <View style={[styles.glassContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <SvgLinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={lightWaterColor} stopOpacity="0.9" />
              <Stop offset="0.5" stopColor={waterColor} stopOpacity="0.95" />
              <Stop offset="1" stopColor={waterColor} stopOpacity="1" />
            </SvgLinearGradient>

            <SvgLinearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#B3E5FC" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#81D4FA" stopOpacity="0.3" />
            </SvgLinearGradient>

            <ClipPath id="circleClip">
              <Circle cx={center} cy={center} r={radius - 15} />
            </ClipPath>
          </Defs>

          {/* Glass base */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 10}
            fill="url(#glassGrad)"
            opacity="0.2"
          />

          {/* Water confined inside circle */}
          {level > 0 && (
            <G clipPath="url(#circleClip)">
              <AnimatedPath
                d={`M 0 0 L ${size} 0 L ${size} ${size} L 0 ${size} Z`}
                fill="url(#waterGrad)"
                translateX={shakeX}
                translateY={waterStartY}
              />

              <AnimatedPath
                d={`M 0 -15
                  Q ${size * 0.25} -30 ${size * 0.5} -15
                  T ${size} -15
                  L ${size} ${size}
                  L 0 ${size}
                  Z`}
                fill={waterColor}
                opacity="0.7"
                translateX={shakeX}
                translateY={Animated.add(waterStartY, enhancedWaveOffset)}
              />

              <AnimatedPath
                d={`M 0 -10
                  Q ${size * 0.33} 10 ${size * 0.66} -10
                  T ${size} -10
                  L ${size} ${size}
                  L 0 ${size}
                  Z`}
                fill={lightWaterColor}
                opacity="0.4"
                translateX={Animated.multiply(shakeX, 0.7)}
                translateY={waveY2}
              />

              {isShaking && (
                <>
                  <AnimatedCircle
                    cx={Animated.add(center, shakeX)}
                    cy={waveY1}
                    r={Animated.multiply(splashScale, 30)}
                    fill="none"
                    stroke={lightWaterColor}
                    strokeWidth="3"
                    opacity={splashOpacity}
                  />
                  <AnimatedCircle
                    cx={Animated.add(center, Animated.multiply(shakeX, 1.2))}
                    cy={waveY1}
                    r={Animated.multiply(splashScale, 50)}
                    fill="none"
                    stroke={lightWaterColor}
                    strokeWidth="2"
                    opacity={Animated.multiply(splashOpacity, 0.6)}
                  />
                  <AnimatedCircle
                    cx={Animated.add(center, Animated.multiply(shakeX, 0.8))}
                    cy={waveY2}
                    r={Animated.multiply(splashScale, 70)}
                    fill="none"
                    stroke={waterColor}
                    strokeWidth="2"
                    opacity={Animated.multiply(splashOpacity, 0.3)}
                  />
                </>
              )}
            </G>
          )}

          {/* Cup outline */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 10}
            fill="none"
            stroke="#B3E5FC"
            strokeWidth="20"
            opacity="0.6"
          />

          <Circle
            cx={center}
            cy={center}
            r={radius - 5}
            fill="none"
            stroke="#E1F5FE"
            strokeWidth="8"
            opacity="0.8"
          />
        </Svg>

        <View style={styles.volumeContainer}>
          <Text style={styles.volumeText}>{volume}ml</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  glassContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  volumeContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  volumeText: {
    color: "#FFFFFF",
    fontSize: 40, // smaller text
    fontFamily: "PoppinsBlack",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressBar: {
    width: "80%",
    height: 6,
    backgroundColor: "rgba(179, 229, 252, 0.3)",
    borderRadius: 3,
    marginTop: 30,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4FC3F7",
    borderRadius: 3,
  },
});
