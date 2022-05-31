import type { Patient, PatientStatus } from "@/types/patient";

// Import the functions you need from the SDKs you need

// import Firebase
import { initializeApp } from "firebase/app";

// import Realtime Database
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE70DY6z_j8NEo3ls3VO_tbHaDA8e0jXQ",
  authDomain: "patient-simulator.firebaseapp.com",
  databaseURL:
    "https://patient-simulator-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "patient-simulator",
  storageBucket: "patient-simulator.appspot.com",
  messagingSenderId: "1069997834909",
  appId: "1:1069997834909:web:aad47310df2ef0ffb7ca74",
  measurementId: "G-QN55VW7KV2",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase();
const dbRef = ref(getDatabase());
// Realtime database functions

export const createPatient = (patient: Patient) => {
  set(ref(db, "patients/" + patient.id), patient);
};

export const getPatient = async (id: number): Promise<Patient | undefined> => {
  const test = await get(child(dbRef, `patients/${id}`));
  return test.exists() ? test.val() : undefined;
};

export const deletePatient = async (id: number): Promise<string> => {
  await remove(child(dbRef, `patients/${id}`));
  return "deleted";
};

export const getPatients = async () => {
  const test = await get(child(dbRef, `patients/`));
  return test.exists() ? test.val() : undefined;
};

export const updatePatientStatus = (
  id: number,
  time: string,
  status: PatientStatus
) => {
  // const newKey = push(child(ref(db), `patients/${id}/status/`)).key;
  const updates: { [key: string]: PatientStatus } = {};
  updates["patients/" + id + "/status/" + time + "/"] = status;
  return update(ref(db), updates);
};
