import {Image, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import ImageList from './ImageList';
import ImageViewing from 'react-native-image-viewing/dist/ImageViewing';
import ImageFooter from './ImageFooter';
import {ImageType} from '../utils/types';

type Props = {
  images: ImageType[];
  setImages: Dispatch<SetStateAction<ImageType[]>>;
};

const ImageCarousel = ({images, setImages}: Props) => {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const openCameraRoll = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 400,
      cropping: true,
      multiple: true,
      maxFiles: 10,
      minFiles: 3,
      includeBase64: true,
    })
      .then(response => {
        response.map(image => {
          const newImage: ImageType = {
            uri: image.sourceURL ? image.sourceURL : ' ',
          };
          setImages(prevImages => [...prevImages, newImage]);
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onSelect = (images: ImageType[], index: number) => {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);

  return images.length !== 0 ? (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={images.map(image => (image.uri ? image.uri : 'NULL'))}
        onPress={index => onSelect(images, index)}
        width={220}
        height={220}
        margin={2}
        borderRadius={7}
      />
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        presentationStyle="overFullScreen"
        backgroundColor="white"
        visible={isVisible}
        onRequestClose={onRequestClose}
        FooterComponent={({imageIndex}) => (
          <ImageFooter imageIndex={imageIndex} imagesCount={images.length} />
        )}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.root2}>
      <TouchableOpacity onPress={openCameraRoll}>
        <Image
          source={{
            uri: 'https://media.istockphoto.com/id/1248723171/vector/camera-photo-upload-icon-on-isolated-white-background-eps-10-vector.jpg?s=612x612&w=0&k=20&c=e-OBJ2jbB-W_vfEwNCip4PW4DqhHGXYMtC3K_mzOac0=',
          }}
          style={styles.noPictures}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  root2: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  noPictures: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginBottom: '5%',
    opacity: 0.2,
  },
});
