import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Card} from '@rneui/base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RentalType, RecentSearchType} from '../utils/types';

type Props = {
  rental?: RentalType;
  search?: RecentSearchType;
  handleHomeClick?: (rental: RentalType) => void;
  handleRecentClick?: (search: RecentSearchType) => void;
};

const RentalCard: React.FC<Props> = ({
  rental,
  search,
  handleHomeClick,
  handleRecentClick,
}) => {
  return rental && handleHomeClick ? (
    <TouchableOpacity
      style={{marginBottom: 15}}
      onPress={() => handleHomeClick(rental)}>
      <Card
        containerStyle={{
          borderRadius: 20,
          backgroundColor: 'white',
        }}>
        {rental.data.homePictures !== null &&
        rental.data.homePictures !==
          'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg' ? (
          <Card.Image
            style={{borderRadius: 5, marginBottom: 10}}
            source={{uri: rental.data.homePictures[0].uri}}
          />
        ) : (
          <Card.Image
            style={{borderRadius: 5, marginBottom: 10}}
            source={require('../images/No_Images_Found.png')}
          />
        )}
        <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>
          {rental.data.address.fullAddress}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '3%',
          }}>
          <Text>Status of Rental:</Text>
          {rental.data.statusOfRental === 'Available' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingLeft: '2%',
              }}>
              <View style={styles.AvailableStatus} />
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '1%',
                }}>
                {rental.data.statusOfRental}
              </Text>
            </View>
          ) : rental.data.statusOfRental === 'Not Renting' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingLeft: '2%',
              }}>
              <View style={styles.notRentingStatus} />
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '1%',
                }}>
                {rental.data.statusOfRental}
              </Text>
            </View>
          ) : rental.data.statusOfRental === 'Occupied' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingLeft: '2%',
              }}>
              <View style={styles.occupiedStatus} />
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '1%',
                }}>
                {rental.data.statusOfRental}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingLeft: '2%',
              }}>
              <View style={styles.unknownStatus} />
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  padding: '1%',
                }}>
                Unknown
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: '1%',
          }}>
          <Text>Rating:</Text>
          {rental.data.overallRating.avgOverallRating !== 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems:'center'
                }}>
                <Text style={styles.rating}>
                  {rental.data.overallRating.avgOverallRating.toFixed(1)}
                </Text>
                <Icon name="star" color="black" size={15} />
              </View>
            </>
          ) : (
            <Text>N/A</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  ) : search && handleRecentClick ? (
    <TouchableOpacity onPress={() => handleRecentClick(search)}>
      <Card
        containerStyle={{
          borderRadius: 20,
          width: 300,
          backgroundColor: 'white',
        }}>
        {search.homePicture !==
        'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg' ? (
          <Card.Image
            style={{borderRadius: 5}}
            source={{uri: search.homePicture}}
          />
        ) : (
          <Card.Image
            style={{borderRadius: 5}}
            source={require('../images/No_Images_Found.png')}
          />
        )}
        <Card.FeaturedTitle
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            color: '#1f3839',
          }}>
          {search.homeAddress}
        </Card.FeaturedTitle>
      </Card>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  rating: {
    fontSize: 16,
    fontWeight: '600',
    paddingRight:'1%'
  },
  occupiedStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  AvailableStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
  notRentingStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  unknownStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
});

export default RentalCard;
