// play audio
export const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync({ uri }, { shouldPlay: true });  
    } catch (error) {
        console.log('error inside play helper method', error.message);
    }
}

// pause audio
export const pause = async (playbackObj, uri) => {
    try {
        return await playbackObj.setStatusAsync({ 
            shouldPlay: false, 
        });  
    } catch (error) {
        console.log('error inside pause helper method', error.message);
    }
};

// resume audio
export const resume = async (playbackObj, uri) => {
    try {
        return await playbackObj.playAsync();  
    } catch (error) {
        console.log('error inside resume helper method', error.message);
    }
};

// select another audio
export const playNext = async ( playbackObj, uri ) => {
    try {
        await playbackObj.stopAsync()
        await playbackObj.unloadAsync();
        return await play(playbackObj, uri)
    } catch (error) {
        console.log('error inside playNext helper method', error.message);
    }
};

export const selectAudio = async (audio, context) => {
    const {
        soundObj, 
        playbackObj, 
        currentAudio, 
        updateState, 
        audioFiles
    } = context;
    // playing audio for the first time.
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio)
      updateState(context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return storeAudioForNextOpening(audio, index);
    }

    // pause audio
    if (
      soundObj.isLoaded && 
      soundObj.isPlaying && 
      currentAudio.id === audio.id
      ) {
        const status = await pause(playbackObj);
        return updateState(context, {soundObj: status, isPlaying: false})
    }

    // resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(context, {soundObj: status, isPlaying: true})
    }

    // select another audio
    if(soundObj.isLoaded && currentAudio.id !== audio.id){
      const status = await playNext(playbackObj, audio.uri)
      const index = audioFiles.indexOf(audio)
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }
}