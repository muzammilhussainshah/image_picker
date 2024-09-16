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
import { LinearGradient } from 'expo-linear-gradient';


export function RenderItem({ item }: any) {
    const [backgroundColorPrimary, setBackgroundColorPrimary] = useState('#ffffff'); // Default background color
    const [backgroundColorSecondary, setBackgroundColorSecondary] = useState('#ffffff'); // Default background color
    const [selectedImages, setSelectedImages] = useState([]);
    useEffect(() => {
        if (item == 'custom') {

        } else {
            const fetchDominantColor = async () => {
                const fileData: any = await CameraRoll.iosGetImageDataById(item.uri);
                const result: any = await ImageColors.getColors(fileData.node.image.filepath, {
                    fallback: '#ffffff', // Fallback color in case extraction fails
                    cache: true,
                });
                console.log(result, 'result')
                if (result.platform === 'android' || result.platform === 'ios') {
                    setBackgroundColorPrimary(result.background); // Use average or dominant color
                    setBackgroundColorSecondary(result.primary); // Use average or dominant color
                }
            };
            fetchDominantColor();
        }
    }, [item?.uri]);

    return (
        <>
            {item == 'custom' ?
                <TouchableOpacity
                    style={[
                        styles.imageContainer,
                        selectedImages.includes(item.uri) && styles.selectedImageContainer,
                    ]}
                >
                    <LinearGradient
                        colors={[backgroundColorPrimary, backgroundColorSecondary,]}
                        style={styles.background}
                    >
                        <View style={[styles.imageWrapper, { justifyContent: "center", alignItems: "center" }]}>
                            <Text >camera</Text>

                        </View>
                    </LinearGradient>
                </TouchableOpacity >
                :
                <TouchableOpacity
                    style={[
                        styles.imageContainer,
                        selectedImages.includes(item.uri) && styles.selectedImageContainer,
                    ]}
                >
                    <LinearGradient
                        colors={[backgroundColorPrimary, backgroundColorSecondary,]}
                        style={styles.background}
                    >
                        <View style={styles.imageWrapper}>

                            <Image
                                style={styles.image}
                                resizeMode='contain'
                                source={{ uri: item.uri }}
                            />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    imageContainer: {
        width: width / 3 - 6, // 3 images per row
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
    background: {
        flex: 1,
        height: '100%', width: '100%',
        borderRadius: 10, overflow: "hidden",
        justifyContent: 'center',
        alignItems: 'center',
    },
});
