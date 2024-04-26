import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ImageList from './ImageList';
import ImageViewing from 'react-native-image-viewing/dist/ImageViewing';
import ImageFooter from './ImageFooter';
import {ImageType} from '../utils/types';

const {width} = Dimensions.get('screen');
const height = width * 0.9;

type Props = {
  homeImages: ImageType[];
};

const RentalDescripImageViewer = ({homeImages}: Props) => {
  const [currentImageIndex, setImageIndex] = useState(1);
  const [images, setImages] = useState<ImageType[]>(homeImages);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setImages(homeImages);
  }, [homeImages]);

  const onSelect = (images: ImageType[], index: number) => {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);

  return (
    <View style={styles.root}>
      <ImageList
        images={images.map(image => (image.uri ? image.uri : 'NULL'))}
        onPress={index => onSelect(images, index)}
        width={width}
        height={height}
        snapEnabled={true}
      />
      {images[0].uri !==
      'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg' ? (
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
      ) : null}
    </View>
  );
};

export default RentalDescripImageViewer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
});
