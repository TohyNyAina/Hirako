import { Text, View, Button, StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return <NavigationContainer>
    <AppNavigator/>
  </NavigationContainer>
}

