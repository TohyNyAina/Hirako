import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const Lyrics = () => {
    return (
        <View styles={styles.container}>
        <Text>Lyrics</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Lyrics;
