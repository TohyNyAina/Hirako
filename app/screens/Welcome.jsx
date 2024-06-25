import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenue sur</Text>
      <Image
        source={require('../../assets/hirako.png')} 
        style={styles.imageh}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainApp')}
      >
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
      <Image
        source={require('../../assets/logo_ispm.png')} 
        style={styles.imagei}
      />
      <Text style={styles.prestext}>Projet version 1.0 ISPM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  welcomeText: {
    fontSize: 22,
    marginBottom: 20,
    color: '#fff'
  },
  imageh: {
    width: 200,
    height: 200,
    marginBottom: 20, 
  },
  button: {
    backgroundColor: '#5252ad',
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 25, 
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, 
  },
  prestext: {
    color: '#fff',
  },
  imagei: {
    marginTop: 30,
    width:50,
    height: 50,
    borderRadius: 18,
  },
});

export default WelcomeScreen;
