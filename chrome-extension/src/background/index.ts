import 'webextension-polyfill';
import { db } from '../../../pages/popup/src/firebase';
import { exampleThemeStorage } from '@extension/storage';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Listen for messages from external sources
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  console.log('requested!', request);
  // if (request.type === 'VERBLIKE_USER' && request.uid && request.email) {
  // Save uid and email to storage
  exampleThemeStorage.get().then(currentTheme => {
    exampleThemeStorage
      .set({
        ...currentTheme,
        uid: request.uid,
        email: request.email,
      })
      .then(() => {
        console.log('Saved uid and email:', request.uid, request.email);
        sendResponse({ success: true });
      });
  });
  // Return true to indicate async response
  return true;
  // }
});

// Listen for UPLOAD_TEXT messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'UPLOAD_TEXT' && request.email && request.text && request.uid) {
    console.log('Uploading text to Firebase');
    // Upload to Firestore: users/{uid}/highlights/{autoId}
    // Ensure the user document exists / is updated with uid and email
    const userDocRef = doc(db, 'users', request.uid);
    setDoc(userDocRef, { uid: request.uid, email: request.email }, { merge: true }).catch(error => {
      console.error('Failed to set user document:', error);
    });
    const highlightsRef = collection(db, 'users', request.uid, 'highlights');
    addDoc(highlightsRef, {
      ...request,
      timestamp: Date.now(),
    })
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    // Indicate async response
    return true;
  }
  // Not handling this message — indicate no async response will be sent
  return false;
});

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
