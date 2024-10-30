import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import PlayListDetail from '../screens/PlayListDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Composant animé pour les icônes d'onglet
const AnimatedIcon = ({ name, library, color, focused, size }) => {
  const scaleValue = new Animated.Value(focused ? 1 : 0.9);

  React.useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: focused ? 1.1 : 1, // Zoom léger quand actif
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const IconComponent = library === 'MaterialIcons' ? MaterialIcons : FontAwesome5;

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <IconComponent name={name} size={size} color={color} />
    </Animated.View>
  );
};

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName, library;

          if (route.name === 'Mes musiques') {
            iconName = 'headset';
            library = 'MaterialIcons';
          } else if (route.name === 'A Lire') {
            iconName = 'compact-disc';
            library = 'FontAwesome5';
          } else if (route.name === 'Liste de lectures') {
            iconName = 'library-music';
            library = 'MaterialIcons';
          }

          return (
            <AnimatedIcon
              name={iconName}
              library={library}
              color={color}
              size={size}
              focused={focused}
            />
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Sans labels, comme Apple Music
        tabBarActiveTintColor: '#f94c57',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        headerShown: false,
      })}
    >
      <Tab.Screen name='Mes musiques' component={AudioList} />
      <Tab.Screen name='A Lire' component={Player} />
      <Tab.Screen name='Liste de lectures' component={PlayListScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10, // ombre pour Android
  },
});

export default AppNavigator;
