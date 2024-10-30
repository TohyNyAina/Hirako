import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import color from '../misc/color';

const OptionModal = ({ visible, currentItem, onClose, options }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 1,
          bounciness: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal animationType="none" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBg} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.modal,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title} numberOfLines={2}>
          {currentItem.filename}
        </Text>
        <View style={styles.optionContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={option.onPress}
              activeOpacity={0.8}
            >
              <Ionicons
                name={option.icon}
                size={22}
                color={color.FONT_LIGHT}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingVertical: 15,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  optionContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingBottom: 15,
    color: color.FONT_LIGHT,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: color.OPTION_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  optionText: {
    color: color.FONT_LIGHT,
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  optionIcon: {
    width: 30,
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
    opacity: 0.75,
  },
});

export default OptionModal;
