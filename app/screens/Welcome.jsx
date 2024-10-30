import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const WelcomeScreen = ({ navigation }) => {
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    // Animation pour l'image
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation pour le texte de bienvenue
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(textTranslateY, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Animation du bouton avec un effet de rebond
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(buttonTranslateY, {
        toValue: 0,
        friction: 6,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Effet de pulse sur le bouton
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.welcomeText,
          { opacity: textOpacity, transform: [{ translateY: textTranslateY }] },
        ]}
      >
        Bienvenue sur
      </Animated.Text>
      <Animated.Image
        source={require('../../assets/hirako.png')}
        style={[styles.imageh, { opacity: imageOpacity, transform: [{ scale: imageScale }] }]}
      />
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{ translateY: buttonTranslateY }, { scale: buttonScale }],
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 29,                 
    color: '#FFFFFF',              
    fontFamily: 'System',         
    fontWeight: '500',             
    marginBottom: 20,              
    textAlign: 'center',
    opacity: 0.9,                   
    letterSpacing: 0.5,            
    lineHeight: 32,                
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  imageh: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  button: {
    backgroundColor: '#f94c57',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#3D3DD8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    opacity: 0.9,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  prestext: {
    color: '#CCCCCC',
    fontSize: 16, 
    fontWeight: '500',    
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 22,
    opacity: 0.85,
  },
  imagei: {
    marginTop: 35,
    width: 65,
    height: 65,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'gray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
});

export default WelcomeScreen;
