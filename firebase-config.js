// Firebase settings for accounts that work on any device.
//
// While this is null, accounts are saved in the browser only (one device per account).
// After you create a Firebase project (see README.md), replace null with the config object
// Firebase shows you under Project settings → Your apps → Web, for example:
//
// window.FIREBASE_CONFIG = {
//   apiKey: "AIza...",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project",
//   storageBucket: "your-project.firebasestorage.app",
//   messagingSenderId: "1234567890",
//   appId: "1:1234567890:web:abc123"
// };
//
// These values are meant to be public. The Firestore rules in firestore.rules are what keep
// each student's progress private.
window.FIREBASE_CONFIG = null;
