import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchCallIds = async () => { // Fetch all call IDs from Firestore
  try {
    const querySnapshot = await getDocs(collection(db, "complaints"));
    return querySnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error("Error fetching call IDs:", error);
    throw error;
  }
};

export const fetchCallById = async (callId) => { // Fetch a specific call by ID from Firestore
  try {
    const callDoc = await getDoc(doc(db, "complaints", callId));
    if (callDoc.exists()) {
      return callDoc.data();
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};
