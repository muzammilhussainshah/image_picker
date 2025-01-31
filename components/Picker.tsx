import React, {
    useEffect,
    useState
} from 'react';
import { RenderItem } from '@/components/RenderImage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { LinearGradient } from 'expo-linear-gradient';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Modal, // Import Modal
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';

export default function Picker({ visible, onClose }: any) {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [endCursor, setEndCursor] = useState<string | null>(null); // For pagination
    const [hasNextPage, setHasNextPage] = useState(true); // Flag for more images
    const [selectedImageDetail, setSelectedImageDetail] = useState<any>(); // State to control modal visibility

    const getGalleryImages = async (afterCursor: string | null = null) => {
        if (loading || !hasNextPage) return;

        setLoading(true);
        try {
            const fetchedImages: any = await CameraRoll.getPhotos({
                first: 9,
                after: afterCursor,
                assetType: 'Photos',
            });

            setImages((prevImages): any => [...prevImages, ...fetchedImages.edges.map((edge: any) => edge.node.image)]);
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
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose} // Close the modal when back button is pressed
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={['custom', ...images]}
                        renderItem={({ item }) => <RenderItem callBack={(selectedImage: any) => {
                            onClose()
                            setSelectedImageDetail(selectedImage)
                        }}
                            item={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                        onEndReached={loadMoreImages} // Trigger loading more images
                        onEndReachedThreshold={0.5} // Load more images when halfway down the list
                        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null} // Show loading spinner at the end
                    />
                </SafeAreaView>
            </Modal>
            {
                selectedImageDetail && Object.keys(selectedImageDetail)?.length > 0 &&
                <View
                    style={[styles.fullHeightWidth]}
                >
                    <LinearGradient
                        colors={[selectedImageDetail.backgroundColorPrimary, selectedImageDetail.backgroundColorSecondary,]}
                        style={[]}
                    >
                        <View style={styles.imageOpacityController}></View>
                        <View style={[styles.imageWrapper]}>
                            <Image
                                style={styles.fullHeightWidth}
                                resizeMode='contain'
                                source={{ uri: selectedImageDetail.image }}
                            />
                        </View>
                    </LinearGradient>
                </View >
            }

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center", alignItems: "center",
        backgroundColor: '#f5f5f5',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        // padding: 20,
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
    fullHeightWidth: { height: '100%', width: '100%', },
    imageOpacityController: { backgroundColor: "rgba(0,0,0,.3)", position: "absolute", zIndex: -2, height: "100%", width: '100%' },
    imageWrapper: { justifyContent: "center", alignItems: "center" },
});
