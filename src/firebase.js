import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDuyt0IeKXAz8Tni2t-qHi67VV7c1FAMNY",
    authDomain: "insta-24c80.firebaseapp.com",
    projectId: "insta-24c80",
    storageBucket: "insta-24c80.appspot.com",
    messagingSenderId: "809167411805",
    appId: "1:809167411805:web:eb5a167406b7947a2f0bb4",
    measurementId: "G-LF658N8HNR"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)

  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()

  export {db, auth, storage}