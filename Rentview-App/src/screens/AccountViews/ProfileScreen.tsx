import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import {AccountStackParamList} from '../../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView} from 'react-native-gesture-handler';
import {db} from '../../config/firebase';
import {auth} from '../../config/firebase';

type ProfileProps = NativeStackScreenProps<
  AccountStackParamList,
  'ProfileScreen'
>;

const ProfileScreen: React.FC<ProfileProps> = ({route, navigation}) => {
  const [phoneNumber, onChangePhoneNumber] = useState<string>('');
  const [username, onChangeUsername] = useState<string>('');
  const [fullName, onChangeFullName] = useState<string>('');
  const user = auth.currentUser;
  const email = user?.email ? user.email : 'Email not found...';
  const userId = user?.uid ? user.uid : '';
  const userInfoRef = doc(db, 'UserReviews', userId);

  useEffect(() => {
    const subscribe = onSnapshot(userInfoRef, userInfoSnapshot => {
      if (userInfoSnapshot.exists()) {
        onChangePhoneNumber(userInfoSnapshot.data().phoneNumber);
        onChangeUsername(userInfoSnapshot.data().username);
        onChangeFullName(userInfoSnapshot.data().fullName);
      }
    });

    return () => subscribe();
  }, []);

  const updateProfileInfo = async () => {
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (userInfoSnapshot.exists()) {
      if (userInfoSnapshot.data().username !== username) {
        const q = query(collection(db, 'UserReviews', userId, 'Reviews'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async document => {
          if (!document.data().isAnonymous) {
            const reviewRef = doc(
              db,
              'HomeReviews',
              document.data().homeId,
              'IndividualRatings',
              userId,
            );
            await updateDoc(reviewRef, {
              reviewerUsername: username,
            });
          }
        });
      }
      await updateDoc(userInfoRef, {
        phoneNumber: phoneNumber,
        username: username,
      });
    }
    navigation.removeListener;
    navigation.navigate('AccountScreen');
  };

  return (
    <View style={{flex: 1, paddingTop: '5%', backgroundColor: 'white'}}>
      <ScrollView>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: '5%',
            marginBottom: '3%',
          }}>
          Basic Information
        </Text>
        <Text style={{marginLeft: '5%', color: '#969696'}}>Full Name</Text>
        <TextInput
          style={styles.nonEditInput}
          editable={false}
          value={fullName}
          maxLength={20}
        />
        <Text style={{marginLeft: '5%', marginTop: '5%', color: '#969696'}}>
          Username
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          maxLength={20}
        />
        <Text style={{marginLeft: '5%', marginTop: '5%', color: '#969696'}}>
          Email
        </Text>
        <TextInput
          style={styles.nonEditInput}
          value={email}
          maxLength={20}
          editable={false}
          selectTextOnFocus={false}
        />
        <Text style={{marginLeft: '5%', marginTop: '5%', color: '#969696'}}>
          Phone Number
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangePhoneNumber}
          value={phoneNumber}
          maxLength={10}
          placeholder="Add your phone number"
          keyboardType="numeric"
        />
      </ScrollView>
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          height: '15%',
          borderTopWidth: 0.2,
          borderColor: 'gray',
        }}>
        <TouchableOpacity style={styles.saveButton} onPress={updateProfileInfo}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 16}}>
            Save
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: '3%',
  },
  input: {
    height: '7%',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    borderBottomWidth: 0.3,
    fontSize: 16,
  },
  nonEditInput: {
    height: '7%',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    borderBottomWidth: 0.3,
    fontSize: 16,
    color: 'gray',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#347544',
    borderColor: '#347544',
    borderWidth: 1.5,
    width: '92%',
    height: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
export default ProfileScreen;
