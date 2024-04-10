import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext, selectAudio } from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';
import { SearchBar } from 'react-native-elements';
import color from '../misc/color';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      searchQuery: '',
      filteredData: [], // Ajout du state pour les données filtrées
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    i => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename || ''}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate('PlayList');
  };

  updateSearch = searchQuery => {
    this.setState({ searchQuery });
    const { dataProvider } = this.context;
    if (!searchQuery || searchQuery.trim() === '') {
      // Si la recherche est vide, afficher toutes les données
      this.setState({ filteredData: [] });
      return;
    }
    const filteredData = dataProvider._data.filter(item => {
      return item.filename && item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    });
    this.setState({ filteredData });
  };
  

  render() {
    const { searchQuery, filteredData } = this.state;
    const dataProvider = filteredData.length ? this.context.dataProvider.cloneWithRows(filteredData) : this.context.dataProvider;

    return (
      <AudioContext.Consumer>
        {({ isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <SearchBar
                placeholder="Chercher de la musique..."
                onChangeText={this.updateSearch}
                value={searchQuery}
                containerStyle={{ backgroundColor: color.APP_BG , borderBottomColor: color.APP_BG , borderTopColor: 'transparent' }}
              />
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                options={[
                  {
                    title: 'Ajouter à la liste de lectures',
                    onPress: this.navigateToPlaylist,
                  },
                ]}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioList;
