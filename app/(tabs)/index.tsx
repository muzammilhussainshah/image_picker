import { RenderItem } from '@/components/RenderImage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
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
} from 'react-native';
// import ImageColors from 'react-native-image-colors'; // Dominant color extraction library
// import * as ImagePicker from 'react-native-image-picker'; // Image Picker library
// import CameraRoll, { iosRequestReadWriteGalleryPermission } from '@react-native-camera-roll/camera-roll';

const { width } = Dimensions.get('window');
const portraitHeight = (width / 3) * 1.5; // Portrait size ratio (3:4)
// import { requestGalleryPermission } from './permissions'; // Import permission function

export default function HomeScreen() {

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const getGalleryImages = async () => {
      // const granted = await requestGalleryPermission();
      // if (granted) {
      const fetchedImages: any = await CameraRoll.getPhotos({
        first: 10,
        assetType: 'Photos',
      });
      console.log(fetchedImages, 'fetchedImages')
      setImages(fetchedImages.edges.map(edge => edge.node.image));
    };
    getGalleryImages();
  }, [])
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
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
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
