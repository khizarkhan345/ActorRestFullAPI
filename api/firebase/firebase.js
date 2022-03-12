// Import the functions you need from the SDKs you need
const firebaseAdmin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

app = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBSNpc6Dkejof0jriYtwD0mKZ8W3qx8UlA",
//   authDomain: "moviedb-e8ee9.firebaseapp.com",
//   projectId: "moviedb-e8ee9",
//   storageBucket: "moviedb-e8ee9.appspot.com",
//   messagingSenderId: "22775131750",
//   appId: "1:22775131750:web:9129cbd25e0a573de907a7",
//   measurementId: "G-GHWWT4JW5Y"
// };

// // Initialize Firebase
// const app = firebaseAdmin.initializeApp(firebaseConfig);

module.exports = app;