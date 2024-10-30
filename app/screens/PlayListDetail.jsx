import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ajoutez une bibliothèque d'icônes
import { selectAudio } from '../misc/audioController';
import color from '../misc/color';
import AudioListItem from '../components/AudioListItem';
import { AudioContext } from '../context/AudioProvider';
import OptionModal from '../components/OptionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayListDetail = props => {
  const context = useContext(AudioContext);
  const playList = props.route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const playAudio = async audio => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };
  const removeAudio = async () => {
    let { isPlaying, isPlayListRunning, soundObj, playbackPosition, activePlayList } = context;

    if (isPlayListRunning && context.currentAudio.id === selectedItem.id) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const newAudios = audios.filter(audio => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.map(item => {
        if (item.id === playList.id) item.audios = newAudios;
        return item;
      });

      AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }

    setAudios(newAudios);
    closeModal();
  };

  const removePlaylist = async () => {
    let { isPlaying, isPlayListRunning, soundObj, playbackPosition, activePlayList } = context;

    if (isPlayListRunning && activePlayList.id === playList.id) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter(item => item.id !== playList.id);

      AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }

    props.navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{playList.title}</Text>
          <TouchableOpacity onPress={removePlaylist}>
            <Ionicons name="trash" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {audios.length ? (
         <FlatList
         contentContainerStyle={styles.listContainer}
         data={audios}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => (
           <View style={styles.audioItemContainer}>
             <AudioListItem
               title={item.filename}
               duration={item.duration}
               isPlaying={context.isPlaying}
               activeListItem={item.id === context.currentAudio.id}
               onAudioPress={() => playAudio(item)}  // Vérifiez que cette fonction est bien définie
               onOptionPress={() => {
                 setSelectedItem(item);
                 setModalVisible(true);
               }}
               titleStyle={styles.audioTitle}
             />
           </View>
         )}
       />
       
        ) : (
          <View style={styles.noAudioContainer}>
            <Ionicons name="musical-notes-outline" size={50} color="#AAAAAA" />
            <Text style={styles.noAudioText}>Aucun Audio Disponible</Text>
          </View>
        )}
      </View>
      <OptionModal
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: 'Supprimer de la liste de lecture', onPress: removeAudio }]}
        currentItem={selectedItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    marginTop: 15,
  },
  audioItemContainer: {
    marginVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    shadowColor: 'rgba(255,255,255,0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  audioTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noAudioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAudioText: {
    fontSize: 20,
    color: '#AAAAAA',
    marginTop: 10,
  },
  separator: {
    height: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor:'#fff',
    marginVertical: 5,
  },
});

export default PlayListDetail;
