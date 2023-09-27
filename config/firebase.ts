import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config();

initializeApp({
  credential: applicationDefault(),
});

export const db = getFirestore();
