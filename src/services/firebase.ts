// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDLyf1CSfuMeEiVnh1gKpptbWXEIxRzGs4",
    authDomain: "sidequest-dev-3f638.firebaseapp.com",
    projectId: "sidequest-dev-3f638",
    storageBucket: "sidequest-dev-3f638.firebasestorage.app",
    messagingSenderId: "895669551546",
    appId: "1:895669551546:web:2842fbaa824bc388a01d83",
    measurementId: "G-SSBHCXJ5L0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);