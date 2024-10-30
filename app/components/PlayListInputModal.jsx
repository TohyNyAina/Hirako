import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import color from '../misc/color'; // Ensure your color.js has the necessary colors defined

const PlayListInputModal = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPlayListName] = useState('');
  const [animation] = useState(new Animated.Value(0));

  const handleOnSubmit = () => {
    if (playListName.trim()) {
      onSubmit(playListName);
      setPlayListName('');
    }
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const modalOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const inputScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalBG, { opacity: modalOpacity }]} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputScale }] }]}>
          <Text style={styles.title}>Créer une nouvelle playlist</Text>
          <TextInput
            value={playListName}
            onChangeText={setPlayListName}
            style={styles.input}
            placeholder="Enter playlist name"
            placeholderTextColor={color.PLACEHOLDER_COLOR} // Ensure this color is defined in your color.js
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleOnSubmit}
          />
          <AntDesign
            name='check'
            size={28}
            color={color.ACTIVE_FONT}
            style={styles.submitIcon}
            onPress={handleOnSubmit}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  inputContainer: {
    width: width - 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 20, 20, 0.85)', // Slightly lighter dark translucent background
    padding: 20,
    elevation: 15, // Adds depth
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff', // White text for better visibility
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff', // White border for the input
    fontSize: 18,
    paddingVertical: 10,
    color: '#ffffff', // Input text color
  },
  submitIcon: {
    padding: 10,
    backgroundColor: '#ff2d55', // Bright red Apple Music color for the icon
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginTop: 15,
    elevation: 5, // Adds depth to the icon
  },
  modalBG: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark transparent background
    zIndex: 0,
  },
});

export default PlayListInputModal;
