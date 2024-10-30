import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import color from '../misc/color';

const Equalizer = ({ onEqualizerChange }) => {
  const [lowFreq, setLowFreq] = useState(0);
  const [midFreq, setMidFreq] = useState(0);
  const [highFreq, setHighFreq] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSliderChange = (frequency, value) => {
    if (frequency === 'low') setLowFreq(value);
    if (frequency === 'mid') setMidFreq(value);
    if (frequency === 'high') setHighFreq(value);
  };

  const handleValidation = () => {
    onEqualizerChange({ low: lowFreq, mid: midFreq, high: highFreq });
    setSuccessMessage('Égaliseur réglé avec succès!');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Égaliseur</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Low</Text>
        <Slider
          style={styles.slider}
          minimumValue={-10}
          maximumValue={10}
          value={lowFreq}
          minimumTrackTintColor={'#f94c57'}
          maximumTrackTintColor={color.FONT_MEDIUM}
          thumbTintColor={'#f94c57'}
          onValueChange={(value) => handleSliderChange('low', value)}
        />
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Mid</Text>
        <Slider
          style={styles.slider}
          minimumValue={-10}
          maximumValue={10}
          value={midFreq}
          minimumTrackTintColor={'#f94c57'}
          maximumTrackTintColor={color.FONT_MEDIUM}
          thumbTintColor={'#f94c57'}
          onValueChange={(value) => handleSliderChange('mid', value)}
        />
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>High</Text>
        <Slider
          style={styles.slider}
          minimumValue={-10}
          maximumValue={10}
          value={highFreq}
          minimumTrackTintColor={'#f94c57'}
          maximumTrackTintColor={color.FONT_MEDIUM}
          thumbTintColor={'#f94c57'}
          onValueChange={(value) => handleSliderChange('high', value)}
        />
      </View>
      <TouchableOpacity 
        style={styles.validateButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer les réglages</Text>
            <Text style={styles.modalMessage}>Voulez-vous appliquer ces réglages?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleValidation}>
                <Text style={styles.buttonText}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Message Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={!!successMessage}
        onRequestClose={() => setSuccessMessage('')}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Text style={styles.successMessage}>{successMessage}</Text>
            <TouchableOpacity style={styles.successButton} onPress={() => setSuccessMessage('')}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: color.APP_BG,
  },
  title: {
    fontSize: 18,
    color: color.FONT,
    marginBottom: 15,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    flex: 1,
    color: color.FONT,
    fontSize: 16,
  },
  slider: {
    flex: 3,
  },
  validateButton: {
    backgroundColor: '#f94c57',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMessage: {
    marginVertical: 15,
    textAlign: 'center',
  },
  modalButtons: {
    TextAlign:'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    width: 250,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Equalizer;
