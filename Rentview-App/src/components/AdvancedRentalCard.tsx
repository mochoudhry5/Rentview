import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {DocumentData} from 'firebase/firestore';
import {Card} from '@rneui/base';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  rental: DocumentData;
  handleView: (homeId: string) => void;
};

const AdvancedRentalCard: React.FC<Props> = ({rental, handleView}) => {
  return (
    <Card>
      {rental.homePictures !== null ? (
        <Card.Image
          style={{borderRadius: 5, marginBottom: 10}}
          source={{uri: rental.homePictures.uri}}
        />
      ) : (
        <Card.Image
          style={{borderRadius: 5, marginBottom: 10}}
          source={require('../images/No_Images_Found.png')}
        />
      )}
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
        }}>
        {rental.fullAddress}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={styles.viewProperty}
          onPress={() => {
            handleView(rental.homeId);
          }}>
          <Text style={{fontWeight: 'bold', color: '#347544'}}>
            Manage Property
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.unclaim}>
          <Text style={{fontWeight: 'bold', color: 'white', paddingLeft:10, paddingRight:10}}>Unclaim</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  rating: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewProperty: {
    borderColor:'#347544',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
  unclaim: {
    backgroundColor: '#848484',
    borderColor: '#848484',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
});

export default AdvancedRentalCard;
