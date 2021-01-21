import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA6wK2NVWPtGTNtpI33qiKYNl4wXIJwWjg",
  authDomain: "sync-video-2af31.firebaseapp.com",
  databaseURL: "https://sync-video-2af31-default-rtdb.firebaseio.com",
  projectId: "sync-video-2af31",
  storageBucket: "sync-video-2af31.appspot.com",
  messagingSenderId: "1084672133737",
  appId: "1:1084672133737:web:8f28bd4a0fb99f7656b0f8",
  measurementId: "G-HV87EVVHKT",
};

const fire =
  firebase.apps.length === 0
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

export const firestore = fire.firestore();
export const auth = fire.auth();
export default fire;
