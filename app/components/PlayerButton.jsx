import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { TouchableOpacity, Animated, Easing } from 'react-native';
import color from '../misc/color';

const PlayerButton = ({ iconType, size = 48, iconColor = color.FONT_LIGHT, onPress }) => {
  const [scale] = useState(new Animated.Value(1));

  const getIconName = (type) => {
    switch (type) {
      case 'PLAY':
        return 'playcircleo';
      case 'PAUSE':
        return 'pausecircle';
      case 'NEXT':
        return 'stepforward';
      case 'PREV':
        return 'stepbackward';
      default:
        return 'questioncircleo';
    }
  };

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.92,
      duration: 100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1.05,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
      onPress();
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={{
          transform: [{ scale }],
          backgroundColor: `linear-gradient(145deg, ${color.GRADIENT_START}, ${color.GRADIENT_END})`,
          padding: size * 0.2,
          borderRadius: size / 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AntDesign name={getIconName(iconType)} size={size * 0.9} color='rgb(128,128,128)' />
      </Animated.View>
    </TouchableOpacity>
  );
};

PlayerButton.propTypes = {
  iconType: PropTypes.oneOf(['PLAY', 'PAUSE', 'NEXT', 'PREV']).isRequired,
  size: PropTypes.number,
  iconColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

export default PlayerButton;
