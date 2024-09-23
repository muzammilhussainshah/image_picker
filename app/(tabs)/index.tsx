import React, { useState } from 'react';
import Picker from '@/components/Picker';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility 
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)} // Open the modal when button is pressed
        style={styles.buttonWrapper}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Open Image Picker</Text>
        </View>
      </TouchableOpacity>

      <Picker
        visible={modalVisible}
        onClose={() => { setModalVisible(false) }} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: '80%',
    justifyContent: 'center',
  },
  modalHeader: {
    alignItems: 'flex-end',
    margin: 10,
  },
  closeText: {
    fontSize: 18,
    color: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 24
  },
  buttonWrapper: {
    position: "absolute",
    zIndex: 2,
    bottom: '20%',
  },
  buttonContainer: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 20
  },
});
