// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImmersiveMode from 'react-native-immersive-mode';
import SplashScreen from './SplashScreen';
import HomeScreen from './src/components/HomeScreen';
import Loading from './LoadingScreen';
import { BalanceProvider } from './src/context/BalanceContext';
import { SoundProvider } from './src/context/SoundContext';
import { UserProvider } from './src/context/UserContext';
import 'react-native-reanimated';
import { AuthProvider } from "./src/context/AuthContext";

export type RootStackParamList = {
  Splash: undefined;
  User: undefined;
  Home: undefined;
  loading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // ✅ Move useEffect INSIDE the component
  useEffect(() => {
    ImmersiveMode.fullLayout(true); // Enable fullscreen layout
    ImmersiveMode.setBarMode('Full'); // Hide nav + status bars
  }, []);

  return (
    <AuthProvider>

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
    </AuthProvider>
  );
}
