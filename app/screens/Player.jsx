import React, { useContext, useEffect } from 'react';
import {View, StyleSheet,Text, Dimensions} from 'react-native';
import Screen from '../components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { changeAudio, selectAudio } from '../misc/audioController';
import { convertTime } from '../misc/helper';

const {width} = Dimensions.get('window')

const Player = () => {
    const context = useContext (AudioContext);
    const { playbackPosition,
        playbackDuration, } = context;

    const calculateSeebBar = () => {
        if(playbackPosition !== null && playbackDuration !== null){
            return playbackPosition / playbackDuration;
        }
        return 0
    };

    useEffect(() => {
        context.loadPreviousAudio();
    }, []);

    const handlePlayPause = async () => {
        await selectAudio(context.currentAudio, context);
        // // play
        // if(context.soundObj === null){
        //     const audio = context.currentAudio;
        //     const status = await play(context.playbackObj, audio.uri)
        //     context.playbackObj.setOnPlaybackStatusUpdate(
        //         context.onPlaybackStatusUpdate
        //     );
        //     return context.updateState(context, {
        //         soundObj: status,
        //         currentAudio: audio,
        //         isPlaying: true,
        //         currentAudioIndex: context.currentAudioIndex
        //     })
        // }
        // // pause
        // if(context.soundObj && context.soundObj.isPlaying){
        //     const status = await pause(context.playbackObj)
        //     return context.updateState(context, {
        //         soundObj: status,
        //         isPlaying: false,
        //     });
        // }
        // // resume 
        // if(context.soundObj && !context.soundObj.isPlaying){
        //     const status = await resume(context.playbackObj)
        //     return context.updateState(context, {
        //         soundObj: status,
        //         isPlaying: true,
        //     });
        // }
    };

    const handleNext = async () => {
        await changeAudio(context, 'next');
        // const { playbackObj, audioFiles, currentAudioIndex, totalAudioCount, updateState } = context;
    
        // let newIndex = currentAudioIndex + 1;
        // if (newIndex >= totalAudioCount) {
        //     newIndex = 0;
        // }
    
        // const newAudio = audioFiles[newIndex];
        // const status = await playNext(playbackObj, newAudio.uri);
    
        // updateState(context, {
        //     currentAudio: newAudio,
        //     playbackObj,
        //     soundObj: status,
        //     isPlaying: true,
        //     currentAudioIndex: newIndex,
        //     playbackPosition: null,
        //     playbackDuration: null,
        // });
    
        // storeAudioForNextOpening(newAudio, newIndex);
    };
    
    const handlePrevious = async () => {
        await changeAudio(context, 'previous')
        // const { playbackObj, audioFiles, currentAudioIndex, totalAudioCount, updateState } = context;
    
        // let newIndex = currentAudioIndex - 1;
        // if (newIndex < 0) {
        //     newIndex = totalAudioCount - 1;
        // }
    
        // const newAudio = audioFiles[newIndex];
        // const status = await playNext(playbackObj, newAudio.uri);
    
        // updateState(context, {
        //     currentAudio: newAudio,
        //     playbackObj,
        //     soundObj: status,
        //     isPlaying: true,
        //     currentAudioIndex: newIndex,
        //     playbackPosition: null,
        //     playbackDuration: null,
        // });
    
        // storeAudioForNextOpening(newAudio, newIndex);
    };

    const renderCurrentTime = () => {
        return convertTime(context.playbackPosition / 1000)
    }

    if(!context.currentAudio) return null;

    return <Screen>
        <View style={styles.container}>
            <Text style={styles.audioCount}>
                {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
            </Text>
            <View style={styles.midBannerContainer}>
                <MaterialCommunityIcons 
                    name="music-circle" 
                    size={300} 
                    color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioTitle}>
                    {context.currentAudio.filename}
                </Text>
                <View 
                    style={{
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                    }}
                >
                    <Text>{renderCurrentTime()}</Text>
                    <Text>{convertTime(context.currentAudio.duration)}</Text>
                </View>
                <Slider
                    style={{width: width, height: 40}}
                    minimumValue={0}
                    maximumValue={1}
                    value={calculateSeebBar()}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                    onValueChange={(value) => {

                    }}
                />
            </View>
            <View style={styles.audioControllers}>
                <PlayerButton iconType='PREV'
                    onPress={handlePrevious}
                />
                <PlayerButton
                    onPress={handlePlayPause} 
                    style={{marginHorizontal: 25}} 
                    iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
                />
                <PlayerButton iconType='NEXT'
                    onPress={handleNext}
                />
            </View>
        </View>
    </Screen>
};

const styles = StyleSheet.create({
    audioControllers: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    container: {
        flex: 1,
    },
    audioCount: {
        textAlign: 'right',
        padding: 15,
        color: color.FONT_LIGHT,
        fontSize: 14,
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioTitle: {
        fontSize: 16,
        color: color.FONT,
        padding: 15,
    }
});

export default Player;
