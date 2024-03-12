import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/Playlist';
import Lyrics from '../screens/Lyrics';

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    return <Tab.Navigator>
        <Tab.Screen name='AudioList' component={AudioList}/>
        <Tab.Screen name='Player' component={Player}/>
        <Tab.Screen name='Lyrics' component={Lyrics}/>
        <Tab.Screen name='PlayList' component={PlayList}/>
    </Tab.Navigator>
}


export default AppNavigator;
