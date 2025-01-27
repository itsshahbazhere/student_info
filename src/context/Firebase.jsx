import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import PropTypes from "prop-types";

import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Create Context
const FirebaseContext = createContext();

// Custom Hook for Firebase
export const useFirebase = () => useContext(FirebaseContext);

// Firebase Provider
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (student) => {
      setUser(student);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signinUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const createStudentWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  };

  const createStudent = async (studentData) => {
    try {
      await setDoc(doc(firestore, "students", studentData.studentID), studentData);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const listStudentData = async () => {
    try {
      return await getDocs(collection(firestore, "students"));
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  };

  const getStudentById = async (studentID) => {
    try {
      const docRef = doc(firestore, "students", studentID);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("Error fetching student:", error);
      return [];
    }
  };

  const updateStudent = async (studentID, updatedData) => {
    try {
      const studentRef = doc(firestore, "students", studentID);
      await updateDoc(studentRef, updatedData);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const deleteStudent = async (studentID) => {
    try {
      await deleteDoc(doc(firestore, "students", studentID));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <FirebaseContext.Provider 
      value={useMemo(() => ({
        signinUserWithEmailAndPassword, 
        signOutUser, 
        createUserWithEmailAndPassword,
        createStudent, 
        updateStudent, 
        deleteStudent, 
        listStudentData, 
        getStudentById, 
        user, 
        loading
      }), [user, loading])} 
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// Add PropTypes validation
FirebaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};