// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, onUnmounted } from "vue";
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
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const patientsCollection = firebaseApp.collection("patients");

export const createPatient = (patient) => {
  return patientsCollection.add(patient);
};

export const getPatient = async (id) => {
  const patient = await patientsCollection.doc(id).get();
  return patient.exists ? patient.data() : null;
};

export const updatePatient = (id, patient) => {
  return patientsCollection.doc(id).update(patient);
};

export const deletePatient = (id) => {
  return patientsCollection.doc(id).delete();
};

export const useLoadPatients = () => {
  const patients = ref([]);
  const close = patientsCollection.onSnapshot((snapshot) => {
    patients.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
  onUnmounted(close);
  return useLoadPatients;
};
