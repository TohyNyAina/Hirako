import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlayListInputModal from '../components/PlayListInputModal';
import { AudioContext } from '../context/AudioProvider';
import PlayListDetail from '../components/PlayListDetail';

let selectedPlayList = {};
const PlayList = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const createPlayList = async playListName => {
    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const audios = addToPlayList ? [addToPlayList] : [];
      const newList = { id: Date.now(), title: playListName, audios };

      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem('playlist');
    if (!result) {
      const defaultPlayList = { id: Date.now(), title: 'My Favorite', audios: [] };
      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: newPlayList });
      await AsyncStorage.setItem('playlist', JSON.stringify(newPlayList));
    } else {
      updateState(context, { playList: JSON.parse(result) });
    }
  };

  useEffect(() => {
    if (!playList.length) renderPlayList();
  }, []);

  const handleBannerPress = async playList => {
    if (addToPlayList) {
      const result = await AsyncStorage.getItem('playlist');

      let oldList = [];
      let updatedList = [];
      let sameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);

        updatedList = oldList.filter(list => {
          if (list.id === playList.id) {
            // we want to check is that same audio is already inside our list or not.
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                // alert with some message
                sameAudio = true;
                return;
              }
            }

            // otherwise update the playlist.
            list.audios = [...list.audios, addToPlayList];
          }

          return list;
        });
      }

      if (sameAudio) {
        Alert.alert(
          'Meme audio detecter!',
          `${addToPlayList.filename} figure déja dans la liste.`
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }

      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));
    }

    // if there is no audio selected then we want open the list.
    selectedPlayList = playList;
    // setShowPlayList(true);
    navigation.navigate('PlayListDetail', playList);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {playList.length
          ? playList.map(item => (
              <TouchableOpacity
                key={item.id.toString()}
                activeOpacity={0.85}
                onPress={() => handleBannerPress(item)}
              >
                <Animated.View style={[styles.playListBanner, { transform: [{ scale: scaleAnim }] }]}>
                  <Text style={styles.playListTitle}>{item.title}</Text>
                  <Text style={styles.audioCount}>
                    {item.audios.length > 1 ? `${item.audios.length} Songs` : `${item.audios.length} Song`}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))
          : null}

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nouvelle Playlist </Text>
        </TouchableOpacity>
      </ScrollView>

      <PlayListInputModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={createPlayList} />
      <PlayListDetail visible={showPlayList} playList={selectedPlayList} onClose={() => setShowPlayList(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  scrollView: {
    padding: 38,
  },
  playListBanner: {
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 30, // Ajustez cette valeur pour descendre la bannière
  },
  playListTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    
  },
  audioCount: {
    marginTop: 3,
    color: '#AAAAAA',
    fontSize: 13,
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#ff4c5b',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 40,
    shadowColor: 'rgba(255, 75, 95, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlayList;
