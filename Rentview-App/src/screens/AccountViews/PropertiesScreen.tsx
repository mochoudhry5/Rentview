import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountStackParamList} from '../../utils/types';
import {auth, db} from '../../config/firebase';
import {ScrollView} from 'react-native-gesture-handler';
import AdvancedRentalCard from '../../components/AdvancedRentalCard';
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  deleteDoc,
} from 'firebase/firestore';

type PropertiesProps = NativeStackScreenProps<
  AccountStackParamList,
  'PropertiesScreen'
>;

const PropertiesScreen: React.FC<PropertiesProps> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId = auth.currentUser ? auth.currentUser.uid : 'NO_USER_ID_FOUND';
  const [allProperties, setAllProperties] = useState<DocumentData[]>([]);
  const userPropertiesRef = query(
    collection(db, 'UserReviews', userId, 'MyProperties'),
  );

  useEffect(() => {
    const subscribe = onSnapshot(userPropertiesRef, docSnapshot => {
      if (docSnapshot.size >= 1) {
        setAllProperties([]);
        docSnapshot.forEach(doc => {
          setAllProperties(prevArr => [...prevArr, doc.data()]);
        });
      } else {
        setAllProperties([]);
      }
      setIsLoading(false);
    });

    return () => subscribe();
  }, []);

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

  const handleUnclaimProperty = async (homeId: string) => {
    const homeInfoRef = doc(db, 'HomeReviews', homeId);
    const myPropertiesRef = doc(
      db,
      'UserReviews',
      userId,
      'MyProperties',
      homeId,
    );
    await deleteDoc(myPropertiesRef);
    await deleteDoc(homeInfoRef);
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <ActivityIndicator
          style={{
            height: '85%',
            alignContent: 'center',
            justifyContent: 'center',
          }}
          size="large"
          color="#1f3839"
        />
      ) : (
        <View style={{flex: 1}}>
          {allProperties.length > 0 ? (
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <ScrollView
                horizontal={false}
                style={{marginBottom: 30}}
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}>
                {allProperties.map(property => (
                  <AdvancedRentalCard
                    key={property.homeId}
                    rental={property}
                    handleView={handleViewProperty}
                    handleUnclaimProperty={handleUnclaimProperty}
                  />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.noReviewsView}>
              <Text style={{fontSize: 25, opacity: 0.5}}>No Properties</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noReviewsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PropertiesScreen;
