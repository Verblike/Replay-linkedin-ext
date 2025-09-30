import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCNKR_zFY30IE7Ae3DAgLDOqzhjR0_XivE',
  authDomain: 'surface-up.firebaseapp.com',
  projectId: 'surface-up',
  storageBucket: 'surface-up.firebasestorage.app',
  messagingSenderId: '595200154159',
  appId: '1:595200154159:web:2a4b6c142ab44b4c5744da',
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getUserDocumentByEmail = async (email: string) => {
  // Assumes you have a 'users' collection with documents keyed by email
  const userDoc = doc(db, 'users', email);
  const snapshot = await getDoc(userDoc);
  return snapshot.exists() ? snapshot.data() : null;
};
