import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import {OtherStackParamList} from '../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {auth} from '../config/firebase';
import {configureGoogle, signInGoogle} from '../config/googleConfig';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '../config/firebase';
import {SafeAreaView} from 'react-native-safe-area-context';

configureGoogle();

type LoginProps = NativeStackScreenProps<OtherStackParamList, 'Login'>;

const Login: React.FC<LoginProps> = () => {
  const signinWithGoogle = async () => {
    const {idToken} = await signInGoogle.signIn();
    const googleCredential = GoogleAuthProvider.credential(idToken);

    await signInWithCredential(auth, googleCredential);

    if (auth.currentUser !== null) {
      await addUserToDb();
    }
  };

  const addUserToDb = async () => {
    let userId = auth.currentUser ? auth.currentUser.uid : '';
    const userInfoRef = doc(db, 'UserReviews', userId);
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (!userInfoSnapshot.exists()) {
      await setDoc(doc(db, 'UserReviews', userId), {
        username: null,
        fullName: null,
        email: auth.currentUser?.email,
        phoneNumber: null,
        recentSearchs: null,
        token: null,
      });
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Image
          style={{
            borderRadius: 5,
            resizeMode: 'center',
          }}
          source={require('../images/FullLogoWithSlogan.png')}
        />
      </SafeAreaView>
      <TouchableOpacity style={styles.googleButton} onPress={signinWithGoogle}>
        <Image
          style={styles.googleIcon}
          source={{
            uri: 'https://i.ibb.co/j82DCcR/search.png',
          }}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={signinWithGoogle}>
        <Image
          style={styles.googleIcon}
          source={{
            uri: 'https://i.ibb.co/j82DCcR/search.png',
          }}
        />
        <Text style={styles.googleButtonText}>___PLACEHOLDER__</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={signinWithGoogle}>
        <Image
          style={styles.googleIcon}
          source={{
            uri: 'https://i.ibb.co/j82DCcR/search.png',
          }}
        />
        <Text style={styles.googleButtonText}>___PLACEHOLDER__</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  googleButton: {
    backgroundColor: 'white',
    borderColor: '#347544',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 34,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButtonText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  googleIcon: {
    height: 24,
    width: 24,
  },
});

export default Login;
