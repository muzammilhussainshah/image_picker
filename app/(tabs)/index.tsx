import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Button,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DominantColor from 'react-native-dominant-color'; // Install this library for dominant color extraction
import FastImage from 'react-native-fast-image'; // For optimized image rendering
import { RenderItem } from '@/components/RenderImage';

const { width } = Dimensions.get('window');
const portraitHeight = (width / 3) * 1.5; // Portrait size ratio (3:4)

export default function HomeScreen() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const openImagePicker = async () => {
    // Ask for permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      setImages(result.assets);
    }
  };

  // const renderItem = ({ item }) => {
  //   const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Default background color

  //   useEffect(() => {
  //     // Extract dominant color from the image and set it as background
  //     const fetchDominantColor = async () => {
  //       try {
  //         const color = await DominantColor.getDominantColor(item.uri);
  //         setBackgroundColor(color);
  //       } catch (error) {
  //         console.error('Error fetching dominant color:', error);
  //       }
  //     };

  //     fetchDominantColor();
  //   }, [item.uri]);

  //   return (
  //     <TouchableOpacity
  //       style={[
  //         styles.imageContainer,
  //         { backgroundColor }, // Set the extracted background color
  //         selectedImages.includes(item.uri) && styles.selectedImageContainer,
  //       ]}
  //       onPress={() => toggleSelectImage(item.uri)}
  //     >
  //       <View style={styles.imageWrapper}>
  //         <FastImage
  //           source={{ uri: item.uri }}
  //           style={styles.image}
  //           resizeMode={FastImage.resizeMode.contain} // Maintain the aspect ratio of the image
  //         />
  //       </View>
  //       {selectedImages.includes(item.uri) && (
  //         <View style={styles.overlay}>
  //           <Text style={styles.checkmark}>✓</Text>
  //         </View>
  //       )}
  //     </TouchableOpacity>
  //   );
  // };
  return (
    <View style={styles.container}>
      {/* <Button title="Open Image Picker" onPress={openImagePicker} /> */}
      <Button title="Open Image Picker" onPress={() => { }} />
      <FlatList
        data={images}
        renderItem={({ item }) => {
          return (
            <RenderItem item={item} />
          )
        }}
        keyExtractor={(item) => item.uri}
        numColumns={3}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: width / 3, // 3 images per row
    height: portraitHeight, // Fixed height to create the portrait effect
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
    margin: 3,
    position: 'relative',
  },
  imageWrapper: {
    width: '90%', // Adjust this based on how much padding you want between the image and the container
    height: '90%', // Adjust this to create spacing between image and background
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedImageContainer: {
    borderColor: 'blue',
    borderWidth: 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 30,
  },
});
