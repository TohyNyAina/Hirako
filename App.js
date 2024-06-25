import React from 'react';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import color from "./app/misc/color";
import 'react-native-gesture-handler';
import WelcomeScreen from './app/screens/Welcome';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainApp"
            component={AppNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}
