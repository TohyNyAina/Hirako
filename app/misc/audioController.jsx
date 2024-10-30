// audioController.js

import { storeAudioForNextOpening } from './helper';

// Fonctions de base de lecture
export const play = async (playbackObj, uri, lastPosition) => {
  try {
    if (!lastPosition) {
      const status = await playbackObj.loadAsync(
        { uri },
        { 
          shouldPlay: true, 
          progressUpdateIntervalMillis: 100,
          positionMillis: 0,
          isLooping: false, // Assurez-vous que le looping est désactivé
        }
      );
      
      // Forcer le démarrage de la lecture
      if (!status.isPlaying) {
        await playbackObj.playAsync();
      }
      
      return status;
    }

    const status = await playbackObj.loadAsync(
      { uri },
      { 
        progressUpdateIntervalMillis: 100,
        positionMillis: lastPosition,
        shouldPlay: true,
        isLooping: false,
      }
    );

    // Forcer le démarrage de la lecture
    if (!status.isPlaying) {
      await playbackObj.playAsync();
    }

    return status;
  } catch (error) {
    console.log('error inside play helper method', error.message);
    throw error; // Propager l'erreur pour une meilleure gestion
  }
};
export const pause = async playbackObj => {
  try {
    const status = await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
    return status;
  } catch (error) {
    console.log('error inside pause helper method', error.message);
  }
};

export const resume = async playbackObj => {
  try {
    const status = await playbackObj.playAsync();
    return status;
  } catch (error) {
    console.log('error inside resume helper method', error.message);
  }
};

// Mise à jour de getNextAudio pour gérer le cas où il n'y a plus d'audio
export const getNextAudio = (context, playMode) => {
  const { currentAudioIndex, totalAudioCount, audioFiles } = context;
  
  if (totalAudioCount === 0) return null;
  
  switch(playMode) {
    case 'shuffle':
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * totalAudioCount);
      } while (randomIndex === currentAudioIndex && totalAudioCount > 1);
      return {
        audio: audioFiles[randomIndex],
        index: randomIndex
      };
      
    case 'loop':
      return {
        audio: audioFiles[currentAudioIndex],
        index: currentAudioIndex
      };
      
    case 'order':
    default:
      const nextIndex = (currentAudioIndex + 1) % totalAudioCount;
      return {
        audio: audioFiles[nextIndex],
        index: nextIndex
      };
  }
};


export const getPreviousAudio = (context, playMode) => {
  const { currentAudioIndex, totalAudioCount, audioFiles } = context;
  
  switch(playMode) {
    case 'shuffle':
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * totalAudioCount);
      } while (randomIndex === currentAudioIndex && totalAudioCount > 1);
      return {
        audio: audioFiles[randomIndex],
        index: randomIndex
      };
      
    case 'loop':
      return {
        audio: audioFiles[currentAudioIndex],
        index: currentAudioIndex
      };
      
    case 'order':
    default:
      const previousIndex = (currentAudioIndex - 1 + totalAudioCount) % totalAudioCount;
      return {
        audio: audioFiles[previousIndex],
        index: previousIndex
      };
  }
};

// Gestionnaire de fin de lecture
// Fonction utilitaire pour vérifier l'état de la lecture
export const checkPlaybackStatus = async (playbackObj) => {
  try {
    const status = await playbackObj.getStatusAsync();
    return status;
  } catch (error) {
    console.log('Error checking playback status:', error);
    return null;
  }
};

// Mise à jour de la fonction handlePlaybackEnd
export const handlePlaybackEnd = async (context, playMode) => {
  try {
    const audioInfo = getNextAudio(context, playMode);
    if (!audioInfo) return; // Sortir si pas d'audio suivant
    
    const { audio, index } = audioInfo;
    
    // Vérifier et arrêter l'audio en cours si nécessaire
    const currentStatus = await checkPlaybackStatus(context.playbackObj);
    if (currentStatus && currentStatus.isLoaded) {
      await context.playbackObj.unloadAsync();
    }
    
    // Charger et jouer le nouvel audio
    const status = await play(context.playbackObj, audio.uri);
    
    context.updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });

    storeAudioForNextOpening(audio, index);
    return status;
  } catch (error) {
    console.log('Error in handlePlaybackEnd:', error);
  }
};


export const selectAudio = async (audio, context, playListInfo = {}) => {
  const {
    soundObj,
    playbackObj,
    currentAudio,
    updateState,
    audioFiles,
  } = context;

  try {
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri, audio.lastPosition);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      
      return storeAudioForNextOpening(audio, index);
    }

    if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }

    if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: true
      });
    }

    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      await playbackObj.stopAsync();
      await playbackObj.unloadAsync();
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      
      return storeAudioForNextOpening(audio, index);
    }
  } catch (error) {
    console.log('error inside selectAudio method:', error.message);
  }
};

export const changeAudio = async (context, select, playMode = 'order') => {
  const { playbackObj, updateState, isPlayListRunning } = context;

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    let audioInfo;

    if (select === 'previous') {
      audioInfo = getPreviousAudio(context, playMode);
    } else {
      audioInfo = getNextAudio(context, playMode);
    }

    const { audio, index } = audioInfo;

    if (isLoaded) {
      await playbackObj.stopAsync();
      await playbackObj.unloadAsync();
    }

    const status = await play(playbackObj, audio.uri);

    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });

    storeAudioForNextOpening(audio, index);
    return status;

  } catch (error) {
    console.log('error inside change audio method:', error.message);
  }
};

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  
  if (soundObj === null) return;

  try {
    const status = await playbackObj.setPositionAsync(Math.floor(soundObj.durationMillis * value));
    
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
    });

    return status;
  } catch (error) {
    console.log('erreur:', error.message);
  }
};