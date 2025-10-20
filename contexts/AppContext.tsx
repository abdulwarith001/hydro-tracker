import { getTimeAwake } from "@/services/generate-reminders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Profile {
  totalGoals: number;
  containerSize: number;
  wake: string;
  sleep: string;
  awakeDuration: number;
  totalCups: number;
}

interface AppContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Profile) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem("settings");

      if (data) {
        setProfile(JSON.parse(data));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setProfile(null);
      }
    } catch (error) {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formValues: any) => {
    try {
      const awakeDuration = getTimeAwake(formValues.sleep, formValues.wake);
      const totalCups = Math.floor(
        Number(formValues.totalGoals) / Number(formValues.containerSize)
      );

      const data = {
        ...formValues,
        awakeDuration,
        totalCups,
        totalGoals: Number(formValues.totalGoals),
        containerSize: Number(formValues.containerSize),
      };

      await AsyncStorage.setItem("settings", JSON.stringify(data));

      setProfile(data);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["settings"]);

      setIsAuthenticated(false);
      setProfile(null);
    } catch (error) {}
  };

  const updateProfile = async (userData: Partial<Profile>) => {
    try {
      const updated = { ...profile, ...userData } as Profile;
      await AsyncStorage.setItem("settings", JSON.stringify(updated));
      setProfile(updated);
    } catch (error) {}
  };

  const value: AppContextType = {
    isAuthenticated,
    isLoading,
    profile,
    login,
    logout,
    updateProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
