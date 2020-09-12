import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC-WI7KFXnCaB9PmuG9qZ-H8pN_vLZcNUo",
    authDomain: "naerata.firebaseapp.com",
    databaseURL: "https://naerata.firebaseio.com",
    projectId: "naerata",
    storageBucket: "naerata.appspot.com",
    messagingSenderId: "753694264665",
    appId: "1:753694264665:web:a77e862e5d430532691048"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;
