import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Gallery Permission',
        message: 'This app needs access to your gallery to pick images.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const granted = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return granted === 'granted';
  }
};

