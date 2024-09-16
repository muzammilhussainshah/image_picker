import { RenderItem } from '@/components/RenderImage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Button,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
const { width } = Dimensions.get('window');
const portraitHeight = (width / 3) * 1.5;

export default function HomeScreen() {

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null); // For pagination
  const [hasNextPage, setHasNextPage] = useState(true); // Flag for more images

  const getGalleryImages = async (afterCursor: string | null = null) => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    try {
      const fetchedImages: any = await CameraRoll.getPhotos({
        first: 9,
        after: afterCursor,
        assetType: 'Photos',
      });
      
      setImages(prevImages => [...prevImages, ...fetchedImages.edges.map((edge: any) => edge.node.image)]);
      setEndCursor(fetchedImages.page_info.end_cursor);
      setHasNextPage(fetchedImages.page_info.has_next_page);
    } catch (error) {
      console.error("Error fetching images: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGalleryImages();
  }, []);

  const loadMoreImages = () => {
    if (hasNextPage && !loading) {
      getGalleryImages(endCursor);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Open Image Picker" onPress={() => { }} />
      <FlatList
        data={['custom',...images]}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        onEndReached={loadMoreImages} // Trigger loading more images
        onEndReachedThreshold={0.5} // Load more images when halfway down the list
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null} // Show loading spinner at the end
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});
