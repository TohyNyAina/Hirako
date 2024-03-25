import React from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';
import color from '../misc/color';

const PlayList = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.playListBanner}>
                <Text>My Favorite</Text>
                <Text style={styles.audioCount}>0 Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => console.log('adding to playlist')} 
                style={{marginTop: 15}}>
                <Text style={styles.playListBtn}>+ Add New Playlist</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    playListBanner: {
        padding: 5,
        backgroundColor: 'rgba(204,204,204,0.3)',
        borderRadius: 5,
    },
    audioCount: {
        marginTop: 3,
        opacity: 0.5,
        fontSize: 14,
    },
    playListBtn: {
        color: color.ACTIVE_BG,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
    }
})

export default PlayList;
