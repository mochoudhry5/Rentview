import React from 'react';
import {Image, ScrollView, TouchableOpacity} from 'react-native';

type Props = {
  images: string[];
  onPress: (index: number) => void;
  width: number;
  height: number;
  snapEnabled?: boolean;
  margin?: number;
  borderRadius?: number;
};

const ImageList = ({
  images,
  onPress,
  width,
  height,
  snapEnabled = false,
  margin = 0,
  borderRadius = 0,
}: Props) => {
  return (
    <ScrollView horizontal pagingEnabled={snapEnabled} scrollEventThrottle={16}>
      {images.map((imageUrl, index) => (
        <TouchableOpacity
          key={`${imageUrl}_${index}`}
          activeOpacity={0.8}
          onPress={() => onPress(index)}>
          {imageUrl !==
          'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg' ? (
            <Image
              source={{uri: imageUrl}}
              style={{
                margin: margin,
                marginBottom: 7,
                width: width,
                height: height,
                borderRadius: borderRadius,
              }}
            />
          ) : (
            <Image
              source={require('../images/No_Images_Found_RD.png')}
              style={{
                margin: margin,
                width: width,
                height: height,
                borderRadius: borderRadius,
              }}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ImageList;
