import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import PlayListDetail from '../screens/PlayListDetail';
import 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}} >
        <Stack.Screen name='PlayList' component={PlayList} />
        <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
    </Stack.Navigator>
}

const AppNavigator = () => {
    return <Tab.Navigator>
        <Tab.Screen 
            name='AudioList' 
            component={AudioList} 
            options={{
                tabBarIcon: ({color, size}) => {
                    return <MaterialIcons name="headset" size={size} color={color} />
                }
            }}
        />
        <Tab.Screen 
            name='Player' 
            component={Player} 
            options={{
                tabBarIcon: ({color, size}) => {
                    return <FontAwesome5 name="compact-disc" size={size} color={color} />
                }
            }}
        />
        <Tab.Screen 
            name='PlayListScreen' 
            component={PlayListScreen} 
            options={{
                tabBarIcon: ({color, size}) => {
                    return <MaterialCommunityIcons name="playlist-music" size={size} color={color} />
                }
            }}
        />
    </Tab.Navigator>
}


export default AppNavigator;
