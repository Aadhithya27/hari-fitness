import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured properly
const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  if (typeof window !== "undefined") {
    console.warn(
      "Firebase environment variables are missing. Using mock/local storage fallback for lead details."
    );
  }
}

export async function getStorageImageUrl(imagePath: string, fallbackPath: string): Promise<string> {
  if (storage) {
    try {
      const imageRef = ref(storage, imagePath);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.warn(`Could not fetch ${imagePath} from Firebase Storage, using local fallback.`);
    }
  }
  return fallbackPath;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export async function savePricingLead(lead: LeadData): Promise<boolean> {
  const timestamp = new Date().toISOString();
  
  // 1. Save to Firestore if database is initialized
  if (db) {
    try {
      const leadsCollection = collection(db, "pricing_leads");
      await addDoc(leadsCollection, {
        ...lead,
        createdAt: serverTimestamp(),
      });
      console.log("Lead successfully saved to Firebase Firestore.");
    } catch (error) {
      console.error("Error saving lead to Firestore:", error);
      throw error; // Throw so that localStorage is not updated and UI displays error
    }
  } else {
    // Simulate network latency if mock database fallback is used
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Lead saved locally (Mock Firebase Storage):", lead);
  }

  // 2. Only save to LocalStorage if Firestore write succeeded or fallback was used
  if (typeof window !== "undefined") {
    localStorage.setItem("hf_pricing_unlocked", "true");
    localStorage.setItem("hf_pricing_user", JSON.stringify({ ...lead, timestamp }));
  }

  return true;
}

export function getPricingUnlockState(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("hf_pricing_unlocked") === "true";
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function saveContactMessage(contact: ContactMessage): Promise<boolean> {
  const timestamp = new Date().toISOString();

  // 1. Save to Firestore if initialized
  if (db) {
    try {
      const contactsCollection = collection(db, "contact_inquiries");
      await addDoc(contactsCollection, {
        ...contact,
        createdAt: serverTimestamp(),
      });
      console.log("Contact message successfully saved to Firebase Firestore.");
    } catch (error) {
      console.error("Error saving contact message to Firestore:", error);
      throw error;
    }
  } else {
    // Fallback latency simulation
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Contact message saved locally (Mock Firebase Storage):", contact);
  }

  // 2. Save to LocalStorage for local logging/mocking
  if (typeof window !== "undefined") {
    const existingLogs = JSON.parse(localStorage.getItem("hf_contact_messages") || "[]");
    existingLogs.push({ ...contact, timestamp });
    localStorage.setItem("hf_contact_messages", JSON.stringify(existingLogs));
  }

  return true;
}

