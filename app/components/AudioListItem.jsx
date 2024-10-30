import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import color from '../misc/color';

const getThumbnailText = filename => filename[0];

const convertTime = minutes => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split('.')[0];
    const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);
    return `${minute.padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
};

const renderPlayPauseIcon = isPlaying => {
  return (
    <Entypo
      name={isPlaying ? 'controller-paus' : 'controller-play'}
      size={28}
      color='#f94c57'
      style={{ opacity: isPlaying ? 1 : 0.7 }}
    />
  );
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
  titleColor,
}) => {
  const scaleAnim = new Animated.Value(1);
  const neonGlow = activeListItem ? 'rgba(255, 109, 0, 0.6)' : 'transparent';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onAudioPress}
      >
        <View style={styles.leftContainer}>
          <View
            style={[
              styles.thumbnail,
              {
                backgroundColor: activeListItem
                  ? 'rgba(255, 255, 255, 0.8)'
                  : '#f94c57',
                shadowColor: neonGlow,
              },
            ]}
          >
            <Animated.Text style={[styles.thumbnailText]}>
              {activeListItem
                ? renderPlayPauseIcon(isPlaying)
                : getThumbnailText(title)}
            </Animated.Text>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={[styles.title, { color: titleColor || '#FFF' }]}>
              {title}
            </Text>
            <Text style={styles.timeText}>{convertTime(duration)}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.rightContainer}>
        <Entypo
          onPress={onOptionPress}
          name='dots-three-vertical'
          size={22}
          color='#FFFFFF99'
          style={styles.optionIcon}
        />
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 55,
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fond transparent noir
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    // borderBottomWidth:2,
    // borderBottomColor:color.FONT_LIGHT
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: 'rgba(255, 109, 0, 0.5)', // Effet néon doux
  },
  thumbnailText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  titleContainer: {
    width: width - 170,
    paddingLeft: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  timeText: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  optionIcon: {
    padding: 10,
  },
});

AudioListItem.propTypes = {
  title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  onOptionPress: PropTypes.func.isRequired,
  onAudioPress: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  activeListItem: PropTypes.bool.isRequired,
  titleColor: PropTypes.string,
};

export default AudioListItem;
