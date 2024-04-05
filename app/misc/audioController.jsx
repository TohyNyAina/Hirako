import { storeAudioForNextOpening } from "../misc/helper";

// play audio
export const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync(
            { uri }, 
            { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
        );  
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
        audioFiles,
        onPlaybackStatusUpdate,
    } = context;
    try {
        let newAudio, status, newIndex;
        // playing audio for the first time.
        if (soundObj === null) {
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
                onPlaybackStatusUpdate
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
                return updateState(context, {
                    soundObj: status, 
                    isPlaying: false, 
                    playbackPosition: status.positionMillis 
                });
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
            status = await playNext(playbackObj, audio.uri)
            newIndex = audioFiles.indexOf(audio)
            updateState(context, {
                currentAudio: audio,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: newIndex,
            });
            return storeAudioForNextOpening(audio, newIndex);
        }
    } catch (error) {
        console.log('error inside select audio method.', error.message);
    }
    
};

export const changeAudio = async (context, select) => {
    
    try {
        const { playbackObj, audioFiles, currentAudioIndex, totalAudioCount, updateState } = context;
        let newIndex, newAudio, status;
        // for next
        if(select === 'next'){
            newIndex = currentAudioIndex + 1;
            if (newIndex >= totalAudioCount) {
                newIndex = 0;
            }

            newAudio = audioFiles[newIndex];
            status = await playNext(playbackObj, newAudio.uri);
        }

        // for previous
        if(select === 'previous'){
            newIndex = currentAudioIndex - 1;
            if (newIndex < 0) {
                newIndex = totalAudioCount - 1;
            }
        
            newAudio = audioFiles[newIndex];
            status = await playNext(playbackObj, newAudio.uri);

        }
        
        updateState(context, {
            currentAudio: newAudio,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: newIndex,
            playbackPosition: null,
            playbackDuration: null,
        });

        storeAudioForNextOpening(newAudio, newIndex);
    } catch (error) {
        console.log('error inside change audio method.', error.message);
    }
    
}

export const moveAudio = async (context, value) => {
    const {soundObj, isPlaying, playbackObj, updateState} = context
    if(soundObj === null || !isPlaying ) return;

    try {
        const status = await playbackObj.setPositionAsync(
            Math.floor(soundObj.durationMillis * value)
        );
        updateState(context, { 
            soundObj: status, 
            playbackPosition: status.positionMillis 
        });
    
        await resume(playbackObj);
    } catch (error) {
        console.log('error inside onSlidingComplete callback', error);
    }
}       
