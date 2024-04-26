import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {initializeAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: 'AIzaSyCYJ_rVk2QBigqLC5WTuOUPIEYlqwfdO4Q',
  authDomain: 'rentview-app-5c601.firebaseapp.com',
  projectId: 'rentview-app-5c601',
  storageBucket: 'rentview-app-5c601.appspot.com',
  messagingSenderId: '795551030882',
  appId: '1:795551030882:web:690f3728a081a3dd6a3b3b',
  measurementId: 'G-N0QHE250QM',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);
export const db = getFirestore(app);
