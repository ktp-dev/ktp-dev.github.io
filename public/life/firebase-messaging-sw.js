importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyASGOQgnF_ZPUrlK20GgQ8L9EMFU8KmrfA",
  authDomain: "ktp-rush.firebaseapp.com",
  databaseURL: "https://ktp-rush-default-rtdb.firebaseio.com",
  projectId: "ktp-rush",
  storageBucket: "ktp-rush.appspot.com",
  messagingSenderId: "544951458062",
  appId: "1:544951458062:web:d692ee1ae27208317ddf5f",
  measurementId: "G-B1P6JKG7JE"
});

const messaging = firebase.messaging();