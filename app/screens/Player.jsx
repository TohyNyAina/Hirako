import React from 'react';
import {View, StyleSheet,Text} from 'react-native';
import Screen from '../components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Player = () => {
    return <Screen>
        <View style={styles.container}>
            <Text style={styles.audioCount}>1 / 99</Text>
            <View style={styles.midBannerContainer}>
                <MaterialCommunityIcons 
                    name="music-circle" 
                    size={300} 
                    color={color.ACTIVE_BG} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioTitle}>Audio File Name</Text>
            </View>
        </View>
    </Screen>
};

const styles = StyleSheet.create({
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
