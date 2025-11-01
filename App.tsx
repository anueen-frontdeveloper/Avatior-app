// App.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "./SplashScreen";
import HomeScreen from "./src/components/HomeScreen";
import "react-native-reanimated";
import Loading from "./LoadingScreen";
import { BalanceProvider } from "./src/context/BalanceContext";
import React from "react";
import { SoundProvider } from "./src/context/SoundContext"; // adjust path as needed
import { StatusBar } from "react-native";
import { UserProvider } from "./src/context/UserContext";
export type RootStackParamList = {
  Splash: undefined;
  User: undefined;
  Home: undefined;
  loading: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SoundProvider>
      <StatusBar hidden={true} />
      <BalanceProvider>
        <UserProvider>
          <NavigationContainer>

            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="loading" component={Loading} />
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>

          </NavigationContainer>
        </UserProvider>
      </BalanceProvider>
    </SoundProvider>
  );
}
