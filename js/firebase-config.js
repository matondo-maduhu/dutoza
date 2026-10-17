/**
 * DUTOZA — Firebase Config
 */
const firebaseConfig = {
  apiKey: "AIzaSyCsyX_J5alzQb1Uh3HjF8KS-YlZnoyc_QU",
  authDomain: "dutoza-304af.firebaseapp.com",
  projectId: "dutoza-304af",
  storageBucket: "dutoza-304af.firebasestorage.app",
  messagingSenderId: "15602132821",
  appId: "1:15602132821:web:8d6b50fbbdc8af13c071dc",
  measurementId: "G-Q2ZRE9FHPG"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
