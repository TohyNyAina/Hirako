import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import PlayListDetail from '../screens/PlayListDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PlayList' component={PlayList} />
      <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Mes musiques'
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='headset' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='A Lire'
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='compact-disc' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Liste de lectures'
        component={PlayListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='library-music' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
