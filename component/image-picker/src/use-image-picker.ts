import { useActionSheet } from '@expo/react-native-action-sheet';
import React from 'react';
import { Alert, Linking } from 'react-native';

import { ImagePickerResponse, ImageSource } from './types';

import ImagePicker from 'react-native-image-crop-picker';

export function useImagePicker(multiple?: boolean): [
  (source?: ImageSource) => void,
  {
    loading: boolean;
    data?: ImagePickerResponse | ImagePickerResponse[];
    error?: Error;
  },
] {
  const isMounted = React.useRef(true);

  const mediaOptions = {
    width: 360,
    height: 360,
    multiple: multiple ? true : false,
    includeBase64: true,
    mediaType: 'photo',
    cropping: true,
  };

  const [response, setResponse] = React.useState<ImagePickerResponse | ImagePickerResponse[]>();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  const onCameraPermissionDenied = React.useCallback(() => {
    Alert.alert('Enable camera access', 'Turn on camera access to shoot and share photo 📸.', [
      { text: 'Cancel' },
      { text: 'Settings', onPress: () => Linking.openURL('app-settings://') },
    ]);
  }, []);

  React.useEffect(() => {
    return () => {
      isMounted.current = false; // Set isMounted to false when the component unmounts
    };
  }, []);

  const onSelectImage = React.useCallback(
    image => {
      if (image) {
        if (!isMounted.current) {
          return;
        }

        if (Array.isArray(image)) {
          const images = image.map(item => {
            return {
              path: item.path,
              width: item.width,
              height: item.height,
              size: item.size,
              data: item.data,
              mime: item.mime,
              modificationDate: item.modificationDate,
            };
          });

          setResponse(images);
        }

        if (image.path && image.width && image.height) {
          setResponse({
            path: image.path,
            width: image.width,
            height: image.height,
            data: image.data,
          });
        } else {
          setError(new Error("Couldn't get the selected image."));
        }
      }

      setLoading(false);
    },
    [onCameraPermissionDenied],
  );

  const openCamera = React.useCallback(
    () =>
      ImagePicker.openCamera(mediaOptions).then(image => {
        onSelectImage(image);
      }),
    [onSelectImage],
  );
  const openGallery = React.useCallback(
    () =>
      ImagePicker.openPicker(mediaOptions).then(image => {
        onSelectImage(image);
      }),
    [onSelectImage],
  );
  const open = React.useCallback(
    (source?: ImageSource) => {
      setLoading(true);
      source == ImageSource.CAMERA ? openCamera() : openGallery();
    },
    [openCamera, openGallery],
  );

  // const deleteImage = React.useCallback((image) => ImagePicker.cleanSingle())

  // const deleteImage = (img: { uri?: string; codigo?: string }, field: any) => {
  //   let filtered = [];

  //   if (img.uri) {
  //     filtered = field.value.filter((image: any) => image.uri !== img.uri);
  //   } else if (img.codigo) {
  //     filtered = field.value.filter(
  //       (image: any) => image.codigo !== img.codigo
  //     );
  //   }

  //   field.onChange(filtered.length ? filtered : undefined);
  // };

  return [open, { loading, data: response, error }];
}

export function useImagePickerActionSheet(title: string): [
  () => void,
  {
    loading: boolean;
    data?: ImagePickerResponse | ImagePickerResponse[];
    error?: Error;
  },
] {
  const [pick, data] = useImagePicker();
  const { showActionSheetWithOptions } = useActionSheet();

  const open = React.useCallback(() => {
    showActionSheetWithOptions(
      {
        title,
        options: ['Camera', 'Photo Library', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (optionIndex?: number) => {
        switch (optionIndex) {
          case 0:
            return pick(ImageSource.CAMERA);
          case 1:
            return pick(ImageSource.GALLERY);
        }
      },
    );
  }, [pick, showActionSheetWithOptions, title]);

  return [open, data];
}
