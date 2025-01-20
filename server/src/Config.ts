import {} from './types';
import dotenv from 'dotenv';
dotenv.config();

import * as admin from "firebase-admin";
import ServiceAccount from "./serviceaccount.json";

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount as admin.ServiceAccount),
    storageBucket: "imaigen.appspot.com",
});
