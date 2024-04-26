import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {AccountStackParamList} from '../../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EditReviewScreen from '../SearchViews/EditReviewScreen';
import {db} from '../../config/firebase';
import {auth} from '../../config/firebase';

type MyReviewProps = NativeStackScreenProps<
  AccountStackParamList,
  'ActivityScreen'
>;

const MyReviews: React.FC<MyReviewProps> = ({navigation}) => {
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [currPropertyReview, setCurrPropertyReview] = useState<DocumentData>();
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]);
  const userId = auth.currentUser ? auth.currentUser.uid : '';
  const userReviewsRef = query(
    collection(db, 'UserReviews', userId, 'Reviews'),
  );

  useEffect(() => {
    const subscribe = onSnapshot(userReviewsRef, querySnapshot => {
      setAllReviews([]);
      querySnapshot.forEach(doc => {
        setAllReviews(prevArr => [...prevArr, doc.data()]);
      });
    });

    return () => subscribe();
  }, []);

  const handleEditReview = (review: DocumentData) => {
    setCurrPropertyReview(review);
    setOnEdit(true);
  };

  const handleViewProperty = async (homeId: string) => {
    const homeInfoRef = doc(db, 'HomeReviews', homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);
    let ownerId = '';

    if (homeInfoSnapshot.exists()) {
      ownerId = homeInfoSnapshot.data().owner.userId;
    }
    navigation.removeListener;
    navigation.navigate('RentalDescription', {
      homeId: homeId,
      ownerId: ownerId,
    });
  };

  return allReviews.length > 0 ? (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flex: 1}}>
        {allReviews.map(review => (
          <View key={review.homeId}>
            <View style={{marginTop: '3%'}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                {review.address.fullAddress}
              </Text>
              <View
                style={{
                  paddingTop: '2%',
                  paddingLeft: '2%',
                  paddingRight: '2%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: '0%',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                  <TouchableOpacity
                    style={styles.viewProperty}
                    onPress={() => {
                      handleViewProperty(review.homeId);
                    }}>
                    <Text style={{fontWeight: 'bold', color: '#347544'}}>
                      View Property
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editReview}
                    onPress={() => {
                      handleEditReview(review);
                    }}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                      Update
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: '5%',
                  }}>
                  <Text
                    style={{color: 'gray', fontSize: 12, paddingLeft: '2%'}}>
                    {review.dateOfReview}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5,
                    paddingTop: '1%',
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {onEdit ? (
        <EditReviewScreen
          currentPropertyReview={currPropertyReview}
          setOnEdit={setOnEdit}
        />
      ) : null}
    </View>
  ) : (
    <View style={styles.noReviewsView}>
      <Text style={{fontSize: 25, opacity: 0.5}}>No Reviews</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewProperty: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: '30%',
    height: 25,
    aligxnSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor:'#347544'
  },
  editReview: {
    alignItems: 'center',
    backgroundColor: '#848484',
    borderWidth: 1,
    width: '30%',
    height: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor:'#848484'
  },
  noReviewsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MyReviews;
