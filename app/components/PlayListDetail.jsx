import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import { selectAudio } from '../misc/audioController';
import AudioListItem from './AudioListItem';
import color from '../misc/color'; // Ensure this has appropriate color definitions

const PlayListDetail = ({ visible, playList, onClose }) => {
  const playAudio = (audio) => {
    selectAudio(audio);
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBG} />
      <View style={styles.container}>
        <Text style={styles.title}>{playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.audioItemContainer}>
              <AudioListItem 
                title={item.filename} 
                duration={item.duration} 
                onAudioPress={() => playAudio(item)} 
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalBG: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1,
  },

  container: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: height * 0.75,
    width: width - 30,
    backgroundColor: '#1E1E1E',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: 50, // Décalage vers le bas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 2,
  },

  listContainer: {
    paddingBottom: 25,
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    opacity: 0.95,
  },

  audioItemContainer: {
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  audioText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default PlayListDetail;

