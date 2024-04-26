import {View, ScrollView} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '../../utils/types';
import RentalCard from '../../components/RentalCard';
import {RentalType} from '../../utils/types';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';

type SearchRentalsProps = NativeStackScreenProps<
  SearchStackParamList,
  'RentalResults'
>;
const RentalResults: React.FC<SearchRentalsProps> = ({route, navigation}) => {
  const userId = auth.currentUser ? auth.currentUser.uid : '';
  const userReviewRef = doc(db, 'UserReviews', userId);

  const handleHomeClick = async (rental: RentalType) => {
    let addOrNot: boolean = true;
    const userReviewSnapshot = await getDoc(userReviewRef);

    if (userReviewSnapshot.exists()) {
      const recentSearchs: string[] = userReviewSnapshot.data().recentSearchs;
      if (recentSearchs) {
        recentSearchs.map((search: string) => {
          if (search === rental.homeId) {
            addOrNot = false;
          }
        });
      }
      if (addOrNot) {
        if (recentSearchs) {
          await updateDoc(userReviewRef, {
            recentSearchs: [rental.homeId, ...recentSearchs],
          });
        } else {
          await updateDoc(userReviewRef, {
            recentSearchs: [rental.homeId],
          });
        }
      }
    }

    navigation.removeListener;
    navigation.navigate('RentalDescription', {
      homeId: rental.homeId,
      ownerId: rental.data.owner.userId,
    });
  };

  return (
    <View style={{marginBottom: 15}}>
      <ScrollView
        style={{marginTop: 10, height: '100%', backgroundColor:'white'}}
        contentContainerStyle={{flexGrow: 1}}>
        {route.params.rentals.map(rental => (
          <RentalCard
            key={rental.homeId}
            rental={rental}
            handleHomeClick={handleHomeClick}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RentalResults;
