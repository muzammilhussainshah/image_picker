import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageColors from 'react-native-image-colors';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const portraitHeight = (width / 3) * 1.5; // Portrait size ratio (3:4)
import { CameraRoll } from '@react-native-camera-roll/camera-roll';


export function RenderItem({ item }) {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Default background color
    const [selectedImages, setSelectedImages] = useState([]);

    // useEffect(() => {
    //     // Extract dominant color from the image and set it as background
    //     const fetchDominantColor = async () => {
    //         try {
    //             const color = await DominantColor.getDominantColor(item.uri);
    //             setBackgroundColor(color);
    //         } catch (error) {
    //             console.error('Error fetching dominant color:', error);
    //         }
    //     };

    //     fetchDominantColor();
    // }, [item.uri]);
    console.log(item.uri, 'item')
    useEffect(() => {
        // Extract dominant color from the image and set it as background
        const fetchDominantColor = async () => {
            const fileData = await CameraRoll.iosGetImageDataById(item.uri);
            const result = await ImageColors.getColors(fileData.node.image.filepath, {
                fallback: '#ffffff', // Fallback color in case extraction fails
                cache: true,
            });
            console.log(result, 'result')
            if (result.platform === 'android' || result.platform === 'ios') {
                setBackgroundColor(result.detail); // Use average or dominant color
            }
        };
        fetchDominantColor();
    }, [item.uri]);

    const toggleSelectImage = (uri) => {
        if (selectedImages.includes(uri)) {
            setSelectedImages(selectedImages.filter((imageUri) => imageUri !== uri));
        } else {
            setSelectedImages([...selectedImages, uri]);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.imageContainer,
                { backgroundColor }, // Set the extracted background color
                selectedImages.includes(item.uri) && styles.selectedImageContainer,
            ]}
            onPress={() => toggleSelectImage(item.uri)}
        >
            <View style={styles.imageWrapper}>
                {/* <FastImage
                    source={{ uri: item.uri }}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.contain} // Maintain the aspect ratio of the image
                /> */}
                <Image
                    style={styles.image}
                    resizeMode='contain'
                    source={{ uri: item.uri }}
                />
            </View>
            {selectedImages.includes(item.uri) && (
                <View style={styles.overlay}>
                    <Text style={styles.checkmark}>✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

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
        width: '100%', // Adjust this based on how much padding you want between the image and the container
        height: '100%', // Adjust this to create spacing between image and background
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
