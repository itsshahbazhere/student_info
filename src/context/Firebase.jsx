import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDL1_lOOmT5X0m6z0lK3k5_IaQNuhJ1FDE",
  authDomain: "student-app-dca16.firebaseapp.com",
  projectId: "student-app-dca16",
  storageBucket: "student-app-dca16.firebasestorage.app",
  messagingSenderId: "244121872965",
  appId: "1:244121872965:web:11808da621455dfb0ad12c",
  measurementId: "G-KJ7M09YHD1",
  databaseURL: "https://student-app-dca16-default-rtdb.firebaseio.com/",
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
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // **Create a new student record**
  const createStudent = async (studentData) => {
    try {
      await setDoc(doc(firestore, "students", studentData.studentID), studentData);
      console.log("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // **Retrieve all students from Firestore**
  const listStudentData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "students"));
      return querySnapshot;
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // **Retrieve a single student by ID**
  const getStudentById = async (studentID) => {
    try {
      const docRef = doc(firestore, "students", studentID);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  // **Update student record**
  const updateStudent = async (studentID, updatedData) => {
  try {
    const studentRef = doc(firestore, "students", studentID);
    const docSnap = await getDoc(studentRef);
    
    if (!docSnap.exists()) {
      console.log("No document found to update!");
      return;
    }

    // Update document in Firestore
    await updateDoc(studentRef, updatedData);
    console.log("Student updated successfully!");

    // Optionally, refetch data to update UI from Firestore after the update
    const updatedDoc = await getDoc(studentRef);
    if (updatedDoc.exists()) {
      // Update the state to reflect the changes
      console.log("Updated document:", updatedDoc.data());
    }
  } catch (error) {
    console.error("Error updating student:", error);
  }
};


  // **Delete a student record**
  const deleteStudent = async (studentID) => {
    try {
      await deleteDoc(doc(firestore, "students", studentID));
      console.log("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <FirebaseContext.Provider 
      value={{ 
        createStudent, 
        updateStudent, 
        deleteStudent, 
        listStudentData, 
        getStudentById, 
        user, 
        loading
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
