import { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageColors from 'react-native-image-colors';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const portraitHeight = (width / 3) * 1.5; // Portrait size ratio (3:4)
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { LinearGradient } from 'expo-linear-gradient';


export function RenderItem({ item, callBack }: any) {
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
                    setBackgroundColorSecondary(result.primary ); // Use average or dominant color
                }
            };
            fetchDominantColor();
        }
    }, [item?.uri]);
    // const requestCameraPermission = async () => {
    //     if (Platform.OS !== 'web') {
    //         const { status } = await ImagePicker.requestCameraPermissionsAsync();
    //         if (status !== 'granted') {
    //             alert('Sorry, we need camera permissions to make this work!');
    //         }
    //     }
    // };
    // Camera open karne ke liye function
    const openCamera = async () => {
        console.log(ImagePicker, 'ImagePicker')
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // setImage(result.assets[0].uri);
            // const result: any = await ImageColors.getColors(result.assets[0].uri, {
            //     fallback: '#ffffff', // Fallback color in case extraction fails
            //     cache: true,
            // });
            // if (result.platform === 'android' || result.platform === 'ios') {
            //     setBackgroundColorPrimary(result.background); // Use average or dominant color
            //     setBackgroundColorSecondary(result.primary); // Use average or dominant color
            //     callBack({ image: result.assets[0].uri, backgroundColorPrimary: result.background, backgroundColorSecondary: result.primary })
            // }

        }
    };

    return (
        <>
            {item == 'custom' ?
                <TouchableOpacity
                    onPress={openCamera}
                    style={[
                        styles.imageContainer,
                        selectedImages.includes(item.uri) && styles.selectedImageContainer,
                    ]}
                >
                    <LinearGradient
                        colors={[backgroundColorPrimary, backgroundColorSecondary,]}
                        style={[styles.background, { borderWidth: 1, }]}
                    >
                        <View style={[styles.imageWrapper, { justifyContent: "center", alignItems: "center" }]}>

                            <Text >Camera</Text>
                            <Image
                                style={{ height: 50, width: 50 }}
                                resizeMode='contain'
                                // source={{ uri: 'https://e7.pngegg.com/pngimages/21/312/png-clipart-camera-computer-icons-graphy-camera-icon-camera-lens-camera-icon.png' }}
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1206/1206803.png' }}
                            />
                        </View>
                    </LinearGradient>
                </TouchableOpacity >
                :
                <TouchableOpacity
                    onPress={async () => {
                        const fileData: any = await CameraRoll.iosGetImageDataById(item.uri);
                        callBack({ image: fileData?.node?.image?.filepath, backgroundColorPrimary, backgroundColorSecondary })
                    }}
                    style={[
                        styles.imageContainer,
                        selectedImages.includes(item.uri) && styles.selectedImageContainer,
                    ]}
                >
                    <LinearGradient
                        colors={[backgroundColorPrimary, backgroundColorSecondary,]}
                        style={[styles.background, {}]}
                    >
                        <View style={{ backgroundColor: "rgba(0,0,0,.3)", position: "absolute",zIndex:-2, height: "100%", width: '100%' }}></View>
                        <View style={styles.imageWrapper}>

                            <Image
                                style={styles.image}
                                // blurRadius={1}
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
