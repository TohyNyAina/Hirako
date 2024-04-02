import React from 'react';
import {View, StyleSheet, Modal, FlatList} from 'react-native';

const PlayListDetail = ({visible, playList}) => {
    return (
        <Modal visible={visible} animationType='slide' transparent >
            <View>
                <Text>{playList.title}</Text>
                <FlatList data={playList.audios} keyExtractor={item => item.id.toString()} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({})

export default PlayListDetail;
