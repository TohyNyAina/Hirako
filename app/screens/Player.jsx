import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity,Modal } from 'react-native';
import Screen from '../components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { changeAudio, moveAudio, selectAudio } from '../misc/audioController';
import { convertTime } from '../misc/helper';
import Equalizer from '../components/Equalizer';
const { width } = Dimensions.get('window');

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [playMode, setPlayMode] = useState('order');
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio, isPlaying } = context;
  const [isEqualizerVisible, setIsEqualizerVisible] = useState(false); 
  const calculateSeekBar = () => {
    if (playbackPosition && playbackDuration) {
      return playbackPosition / playbackDuration;
    } else if (currentAudio.lastPosition && currentAudio.duration) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

  context.playbackObj.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded) {
      context.updateState(context, {
        playbackPosition: status.positionMillis,
        playbackDuration: status.durationMillis,
      });
    }
  });

  useEffect(() => {
    if (context.playbackObj) {
      context.playbackObj.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.isPlaying && status.positionMillis !== undefined) {
          context.updateState(context, {
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis,
          });
          setCurrentPosition(convertTime(status.positionMillis / 1000));
        }
        if (status.didJustFinish) {
          context.updateState(context, { isPlaying: false });
          handlePlaybackEnd(context, playMode);
        }
      });
    }
  }, [context.playbackObj, playMode]);

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleNext = async () => {
    await changeAudio(context, 'next', playMode);
  };

  const handlePrevious = async () => {
    await changeAudio(context, 'previous', playMode);
  };

  const togglePlayMode = () => {
    setPlayMode((prevMode) => {
      switch (prevMode) {
        case 'order':
          return 'shuffle';
        case 'shuffle':
          return 'loop';
        case 'loop':
          return 'order';
        default:
          return 'order';
      }
    });
  };
  const handleEqualizerChange = (equalizerValues) => {
    // This function will receive the updated frequency values
    // Here, you can integrate these values with your audio controller
    // e.g., adjust audio playback frequencies or effects
    console.log('Equalizer values:', equalizerValues);
  };

  const handleSliderChange = (value) => {
    setCurrentPosition(convertTime(value * context.currentAudio.duration));
  };

  const handleSlidingComplete = async (value) => {
    const seekPosition = value * playbackDuration;
    await moveAudio(context, seekPosition / 1000);
    await context.playbackObj.playFromPositionAsync(seekPosition);
    setCurrentPosition(0);
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  const getPlayModeIcon = () => {
    if (playMode === 'order') return 'format-list-bulleted';
    if (playMode === 'shuffle') return 'shuffle-variant';
    return 'repeat';
  };

  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: 'row' }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: 'bold' }}>From Playlist: </Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}</Text>
        </View>
        
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name='music-circle'
            size={200}
            color={isPlaying ? '#f94c57' : '#A8A8A8'}
          />
          {/*eqqbtn*/}
           {/* <TouchableOpacity 
          style={styles.equalizerButton}
          onPress={() => setIsEqualizerVisible(true)}
         > 
         <MaterialCommunityIcons name="tune" size={30} color={'#f94c57'} /> 
         </TouchableOpacity> */}
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <View style={styles.timeContainer}>
            <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
            <Text>{convertTime(context.currentAudio.duration)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor="#FF2D55"
            maximumTrackTintColor="#888"
            thumbTintColor="#FF2D55"
            onValueChange={handleSliderChange}
            onSlidingComplete={handleSlidingComplete}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType='PREV' onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? 'PAUSE' : 'PLAY'}
            />
            <PlayerButton iconType='NEXT' onPress={handleNext} />
          </View>

         {/* Equalizer Modal */}
         <Modal
          visible={isEqualizerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEqualizerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setIsEqualizerVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>EQ</Text>
              <Equalizer onEqualizerChange={handleEqualizerChange} />
            </View>
          </View>
        </Modal>
        </View>
        <View style={styles.playModeContainer}>
          <TouchableOpacity onPress={togglePlayMode}>
            <MaterialCommunityIcons name={getPlayModeIcon()} size={40} color="#f94c57" />
          </TouchableOpacity>
          
        </View>
      </View>
       
      
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  audioCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 15,
  },
  playlistText: {
    fontWeight: 'bold',
    color: '#BBBBBB',
  },
  playlistTitle: {
    color: '#BBBBBB',
  },
  audioCount: {
    color: '#BBBBBB',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 12 },
  },
  audioTitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  equalizerButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgb(128,128,128)', 
    borderRadius: 15, // Bords plus arrondis pour un aspect plus doux
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Ombrage plus prononcé en hauteur
    shadowOpacity: 0.25, // Opacité réduite pour un effet subtil
    shadowRadius: 10,
    marginVertical: 16,
    elevation: 5, // Ajout d'une ombre pour les appareils Android
    borderWidth: 1,
    borderColor: '#3A3A3A', // Ajout d'une bordure subtile
  },
  
  timeText: {
    fontSize: 30,
    color: '#F5F5F5',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  slider: {
    width: '95%',
    height: 8,
    backgroundColor: '#444',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 20,
  },
  audioControllers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  playPauseButton: {
    backgroundColor: '#FF2D55',
    borderRadius: 50,
    padding: 15,
  },
  playModeContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'grey',
    padding: 20,
    borderRadius: 10,
    position: 'relative', // Allows positioning the close button
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    color: color.FONT,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});




export default Player;
