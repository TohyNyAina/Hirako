import React, { Component } from 'react';
import {  Modal,Animated, ImageBackground, Alert,Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import { play, pause, resume, playNext, selectAudio } from '../misc/audioController';
import OptionModal from '../components/OptionModal';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../misc/color';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    
    // Initialize DataProvider
    this.dataProvider = new DataProvider((r1, r2) => r1.id !== r2.id);
    
    this.state = {
      optionModalVisible: false,
      searchQuery: '',
      favorites: [],
      currentView: 'all',
      dataProvider: this.dataProvider.cloneWithRows([]),
      playlists: [],
      sortModalVisible: false,
      isPlayingButtonVisible: false,
    };

    // Initialize LayoutProvider
    this.layoutProvider = new LayoutProvider(
      () => 'audio',
      (type, dim) => {
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
      }
    );

    this.currentItem = {};
    this.playingButtonOpacity = new Animated.Value(1);
  }

  async componentDidMount() {
    await this.loadFavorites();
    await this.loadPlaylists();
    this.context.loadPreviousAudio();
    this.updateDataProvider(this.context.audioFiles || []);
  }
    // Function to scroll to the currently playing song
    scrollToPlayingSong = () => {
      const { currentAudioIndex } = this.context;
      if (typeof currentAudioIndex === 'number') {
        this.recyclerListViewRef.scrollToIndex(currentAudioIndex, true);
      }
    };
    renderFloatingButton = () => (
      <Animated.View style={[styles.floatingButtonContainer, { opacity: this.playingButtonOpacity }]}>
    
      <TouchableOpacity onPress={this.scrollToPlayingSong} style={styles.floatingButton}>
          <Ionicons name="musical-notes" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );

  loadPlaylists = async () => {
    try {
      const savedPlaylists = await AsyncStorage.getItem('playlist');
      if (savedPlaylists) {
        const playlists = JSON.parse(savedPlaylists);
        this.setState({ playlists });
      }
    } catch (error) {
      console.log('Error loading playlists:', error);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // Update data provider when context or filters change
    if (
      prevState.currentView !== this.state.currentView ||
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.favorites !== this.state.favorites ||
      prevProps.audioFiles !== this.props.audioFiles
    ) {
      this.updateDataProvider(this.getFilteredData());
    }
  }

  updateDataProvider = (data) => {
    if (!data || !Array.isArray(data)) {
      data = [];
    }
    this.setState({
      dataProvider: this.dataProvider.cloneWithRows(data)
    });
  };

  loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        this.setState({ favorites });
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };

  saveFavorites = async (favorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.log('Error saving favorites:', error);
    }
  };

  toggleFavorite = async (audio) => {
    if (!audio || !audio.id) return;

    this.setState(prevState => {
      const isFavorite = prevState.favorites.some(fav => fav.id === audio.id);
      const newFavorites = isFavorite
        ? prevState.favorites.filter(fav => fav.id !== audio.id)
        : [...prevState.favorites, audio];
      
      this.saveFavorites(newFavorites);
      return { favorites: newFavorites };
    });
  };
   // Toggle Sort Modal Visibility
   toggleSortModal = () => {
    this.setState(prevState => ({ sortModalVisible: !prevState.sortModalVisible }));
  };

  //fanokely:ity ilay tri voafantina
  handleSort = (sortOption) => {
    let sortedData = [...this.getFilteredData()]; // Make a copy of the filtered data

    switch (sortOption) {
      case 'alphabetical':
        sortedData.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      case 'reverse-alphabetical':
        sortedData.sort((a, b) => b.filename.localeCompare(a.filename));
        break;
      case 'duration-asc':
        sortedData.sort((a, b) => a.duration - b.duration);
        break;
      case 'duration-desc':
        sortedData.sort((a, b) => b.duration - a.duration);
        break;
        case 'number-first': // Numbers before alphabet
        sortedData.sort((a, b) => {
          const aIsNumber = /^\d/.test(a.filename);
          const bIsNumber = /^\d/.test(b.filename);
  
          // Place number-first files before others
          if (aIsNumber && !bIsNumber) return -1;
          if (!aIsNumber && bIsNumber) return 1;
  
          // Sort normally if both are numbers or non-numbers
          return a.filename.localeCompare(b.filename, undefined, { numeric: true });
        });
        break;
        //tsy nety eee
          // case 'date-added-asc':
          //   sortedData.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
          //   break;
          // case 'date-added-desc':
          //   sortedData.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
          //   break;
 
      default:
        break;
    }

    this.updateDataProvider(sortedData);
    this.toggleSortModal();
  };

  handleAudioPress = async audio => {
    if (!audio) return;
    await selectAudio(audio, this.context);
  };
// nety ihany hoy fano kely XD
  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate('Liste de lectures');
  };

  rowRenderer = (type, item) => {
    if (!item) return null;

    const isPlaying = this.context.isPlaying && this.context.currentAudio.id === item.id;
    const titleColor = isPlaying ? '#f94c57' : color.FONT;

    return (
      <AudioListItem
        title={item.filename || ''}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ optionModalVisible: true });
        }}
        isPlaying={isPlaying}
        activeListItem={this.context.currentAudioIndex === item.index}
        titleColor={titleColor}
      />
    );
  };

   // New function to add audio to selected playlist
   addToPlaylist = async (playlistId) => {
    const { currentItem, playlists } = this;
    
    const playlistToUpdate = playlists.find(playlist => playlist.id === playlistId);
    if (playlistToUpdate && currentItem) {
      const updatedAudios = [...playlistToUpdate.audios, currentItem];
      const updatedPlaylists = playlists.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, audios: updatedAudios } 
          : playlist
      );
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylists));
      this.setState({ playlists: updatedPlaylists });
      Alert.alert('Succes', `${currentItem.filename} a ete ajoute a la playlist .`);
    }
  };

  getFilteredData = () => {
    const { searchQuery, currentView, favorites } = this.state;
    let data = this.context.audioFiles || [];

    // Filter by view type
    if (currentView === 'favorites') {
      data = favorites;
    }

    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      data = data.filter(item => 
        item && item.filename && 
        item.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ensure all items have an id
    return data.map((item, index) => ({
      ...item,
      id: item.id || `${index}`,
      index
    }));
  };
  //j'ai fait en sorte d'integrer les btn de ce style pour mieux faire le tri
  renderTopButtons = () => (
    <View style={styles.topButtonsContainer}>
        <TouchableOpacity 
            onPress={() => this.setState({ currentView: 'all' })} 
            style={[
                styles.viewButton, 
                this.state.currentView === 'all' && styles.activeViewButton
            ]}
        >
            <Ionicons name="list" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.viewButtonText}>Tous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            onPress={() => this.setState({ currentView: 'favorites' })} 
            style={[
                styles.viewButton, 
                this.state.currentView === 'favorites' && styles.activeViewButton
            ]}
        >
            <Ionicons name="heart" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.viewButtonText}>Favoris ({this.state.favorites.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.toggleSortModal} style={styles.viewButton}>
            <Ionicons name="swap-vertical" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.viewButtonText}>Trier</Text>
        </TouchableOpacity>
    </View>
);
//systeme de rendu
  render() {
    const { searchQuery, playlists } = this.state;

    return (
      <Screen>
    
        {this.renderTopButtons()}
        <SearchBar
          placeholder="Rechercher un morceau"
          onChangeText={query => this.setState({ searchQuery: query })}
          value={searchQuery}
          containerStyle={styles.searchContainer}
      
        />
         <View style={styles.listWrapper}>
          {this.state.dataProvider._data.length > 0 ? (
            <RecyclerListView
              ref={ref => (this.recyclerListViewRef = ref)}
              dataProvider={this.state.dataProvider}
              layoutProvider={this.layoutProvider}
              rowRenderer={this.rowRenderer}
              renderAheadOffset={1000}
              style={styles.recyclerList}
              scrollViewProps={{
                contentContainerStyle: styles.scrollContentContainer,
                showsVerticalScrollIndicator: false
              }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun audio trouvé</Text>
            </View>
          )}
        </View>
 <OptionModal
  options={[
    {
      title: this.state.favorites.some(fav => fav.id === this.currentItem.id)
        ? 'Retirer des favoris'
        : 'Ajouter aux favoris',
      onPress: () => {
        this.toggleFavorite(this.currentItem);
        this.setState({ optionModalVisible: false });
      },
      icon: this.state.favorites.some(fav => fav.id === this.currentItem.id)
        ? 'heart-dislike'
        : 'heart'
    },
    {
      title: 'Ajouter à la liste de lectures',
      onPress: this.navigateToPlaylist,
      icon: 'add'
    },
    
  ]}
  currentItem={this.currentItem}
  onClose={() =>
    this.setState({ ...this.state, optionModalVisible: false })
  }
  visible={this.state.optionModalVisible}
/>
        {/* Sort Modal */}
        <Modal
  visible={this.state.sortModalVisible}
  transparent
  onRequestClose={() => this.setState({ sortModalVisible: false })}
  animationType="slide"
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.modalOptionButton} onPress={() => this.handleSort('number-first')}>
        <Text style={styles.modalOptionText}>Nombres avant alphabet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalOptionButton} onPress={() => this.handleSort('alphabetical')}>
        <Text style={styles.modalOptionText}>Alphabétique (A-Z)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalOptionButton} onPress={() => this.handleSort('reverse-alphabetical')}>
        <Text style={styles.modalOptionText}>Alphabétique (Z-A)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalOptionButton} onPress={() => this.handleSort('duration-asc')}>
        <Text style={styles.modalOptionText}>Durée (croissant)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalOptionButton} onPress={() => this.handleSort('duration-desc')}>
        <Text style={styles.modalOptionText}>Durée (décroissant)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.modalCancelButton} onPress={this.toggleSortModal}>
        <Text style={styles.modalCancelText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
{this.renderFloatingButton()}


     </Screen>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    marginHorizontal: 4,
    elevation: 4,
  },
  activeViewButton: {
    backgroundColor: '#f94c57',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.5,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
  },
  buttonIcon: {
    tintColor: '#FFF',
  },
  searchContainer: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    padding: 8,
  },
  searchInputContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    height: 40,
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  recyclerList: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingBottom: 90, // Increased padding to accommodate floating button
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Added elevation for Android
    zIndex: 10,
    overflow: 'hidden', // Ensures the gradient fits within the button shape
  },
  
  floatingButton: {
    width: 55,
    height: 55,
    backgroundColor: '#f94c57',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingBottom: 120, // Extra padding for last item visibility
    marginBottom: 10, // Ensures list fits within screen height
  },
  audioItemContainer: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  durationText: {
    color: '#9e9e9e',
    fontSize: 13,
  },
  favoriteIcon: {
    color: '#FF9500',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#2E2E2E',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  modalOptionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalCancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: '#444',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FF3B30',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#9e9e9e',
    fontSize: 18,
  },

});





export default AudioList;

