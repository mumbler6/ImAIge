import axios from "axios";
import { initializeApp } from "firebase/app";

axios.defaults.headers.common["Content-Type"] = 'application/json';
globalThis.BASE_URL = window.location.host.includes("localhost") ? `http://localhost:5000/api` : `https://imaigen.web.app/api`;

initializeApp({
    apiKey: "AIzaSyA45xvuSUpbEEBWRwiGWNWp7inM3cAWVvI",
    authDomain: "imaigen.firebaseapp.com",
    projectId: "imaigen",
    storageBucket: "imaigen.appspot.com",
    messagingSenderId: "2507692234",
    appId: "1:2507692234:web:7103e227b04a790fd87c33",
    measurementId: "G-61JJLTEZ75"
});