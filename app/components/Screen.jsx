import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import color from '../misc/color';

const Screen = ({ children }) => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30, // Coins plus arrondis
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Séparateur léger
    marginVertical: 10, // Espacement autour du séparateur
  },
});




export default Screen;
