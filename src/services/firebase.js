import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyArBRqkDZncxiOrZSwLXgjA_c-T7os9KeM',
  authDomain: 'qgo-app-fd06f.firebaseapp.com',
  projectId: 'qgo-app-fd06f',
  storageBucket: 'qgo-app-fd06f.appspot.com',
  messagingSenderId: '655702596984',
  appId: '1:655702596984:android:ad531f99bfebd442d63c8d',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
console.log('Firebase App initialized:', app.name);

// Configure Auth with AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
console.log('Firebase Auth initialized with AsyncStorage:', auth);

// Initialize Firestore
export const firestore = getFirestore(app);
console.log('Firestore initialized:', firestore);


