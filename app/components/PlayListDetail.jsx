import React from 'react';
import {
    View, 
    StyleSheet, 
    Modal, 
    FlatList, 
    Text, 
    Dimensions
} from 'react-native';
import color from '../misc/color';

const PlayListDetail = ({visible, playList}) => {
    return (
        <Modal visible={visible} animationType='slide' transparent >
            <View style={styles.container}>
                <Text style={styles.title}>{playList.title}</Text>
                <FlatList 
                    contentContainerStyle={styles.listContainer}
                    data={playList.audios} 
                    keyExtractor={item => item.id.toString()} 
                    renderItem={({item}) => <Text>{item.filename}</Text>}
                />
            </View>
            <View style={[StyleSheet.absoluteFillObject,styles.modalBG]} />
        </Modal>
    );
}

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        height: height - 150,
        width: width - 15,
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
    listContainer: {
        padding: 20,
    },
    title: {
        textAlign: 'center'
    }
});

export default PlayListDetail;
