import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyCukfDHY_SiEZ5h6bHnBvPswdWw_Rahdwo',
  authDomain: 'instagram-clone-sagar.firebaseapp.com',
  databaseURL: 'https://instagram-clone-sagar.firebaseio.com',
  projectId: 'instagram-clone-sagar',
  storageBucket: 'instagram-clone-sagar.appspot.com',
  messagingSenderId: '386123477841',
  appId: '1:386123477841:web:ee3fc11c20ca91978c1970',
  measurementId: 'G-1X0L4CF3KV',
});

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

export { db, auth, storage };
