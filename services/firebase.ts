import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, runTransaction, serverTimestamp, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Vendor, Service, QuoteRequest, Review } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAZlZ4WwqCdSwrhmYGldGBEdxMxr4eOn_0",
  authDomain: "mibodaideal-c0a05.firebaseapp.com",
  projectId: "mibodaideal-c0a05",
  storageBucket: "mibodaideal-c0a05.firebasestorage.app",
  messagingSenderId: "10917823148",
  appId: "1:10917823148:web:51bba8512568bc5b461509"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("Firebase connected with provided credentials. Firestore and Auth instances exported.");

// --- Collection References ---
const vendorsCollectionRef = collection(db, 'vendors');
const servicesCollectionRef = collection(db, 'services');
const quotesCollectionRef = collection(db, 'quotes');
const reviewsCollectionRef = collection(db, 'reviews');

// --- Vendor Functions ---
export const getVendors = async (): Promise<Vendor[]> => {
    const snapshot = await getDocs(vendorsCollectionRef);
    return snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...(doc.data() as any) })) as Vendor[];
};

export const getVendor = async (id: string): Promise<Vendor | null> => {
    const docRef = doc(db, 'vendors', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Vendor;
    } else {
        return null;
    }
};

export const addVendor = async (vendorData: Omit<Vendor, 'id' | 'averageRating' | 'reviewCount'>): Promise<string> => {
    const docRef = await addDoc(vendorsCollectionRef, { ...vendorData, registeredDate: serverTimestamp(), averageRating: 0, reviewCount: 0 });
    return docRef.id;
};

export const updateVendor = async (id: string, vendorData: Partial<Vendor>): Promise<void> => {
    const docRef = doc(db, 'vendors', id);
    await updateDoc(docRef, { ...vendorData });
};

export const deleteVendor = async (id: string): Promise<void> => {
    const docRef = doc(db, 'vendors', id);
    await deleteDoc(docRef);
};

// --- Service Functions ---
export const getServices = async (vendorId: string): Promise<Service[]> => {
    const servicesCollectionRef = collection(db, 'vendors', vendorId, 'services');
    const snapshot = await getDocs(servicesCollectionRef);
    return snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...(doc.data() as any) })) as Service[];
};

export const getService = async (vendorId: string, serviceId: string): Promise<Service | null> => {
    const docRef = doc(db, 'vendors', vendorId, 'services', serviceId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Service;
    } else {
        return null;
    }
};

export const addService = async (vendorId: string, serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'reviewCount'>): Promise<string> => {
    const servicesCollectionRef = collection(db, 'vendors', vendorId, 'services');
    const newServiceRef = await addDoc(servicesCollectionRef, { ...serviceData, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), averageRating: 0, reviewCount: 0 });
    return newServiceRef.id;
};

export const updateService = async (vendorId: string, serviceId: string, serviceData: Partial<Service>): Promise<void> => {
    const docRef = doc(db, 'vendors', vendorId, 'services', serviceId);
    await updateDoc(docRef, { ...serviceData, updatedAt: serverTimestamp() });
};

export const deleteService = async (vendorId: string, serviceId: string): Promise<void> => {
    const docRef = doc(db, 'vendors', vendorId, 'services', serviceId);
    await deleteDoc(docRef);
};

// --- Quote Request Functions ---
export const getQuoteRequests = async (clientId?: string, vendorId?: string): Promise<QuoteRequest[]> => {
    let q: any = quotesCollectionRef;
    if (clientId) {
        q = query(q, where('clientId', '==', clientId));
    }
    if (vendorId) {
        q = query(q, where('vendorId', '==', vendorId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...(doc.data() as any) })) as QuoteRequest[];
};

export const addQuoteRequest = async (quoteRequestData: Omit<QuoteRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const newQuoteRef = await addDoc(quotesCollectionRef, { ...quoteRequestData, createdAt: serverTimestamp(), status: 'pending' });
    return newQuoteRef.id;
};

export const updateQuoteRequest = async (id: string, quoteRequestData: Partial<QuoteRequest>): Promise<void> => {
    const docRef = doc(db, 'quotes', id);
    await updateDoc(docRef, { ...quoteRequestData, updatedAt: serverTimestamp() });
};

// --- Review Functions ---
export const getReviews = async (vendorId?: string, serviceId?: string): Promise<Review[]> => {
    let q: any = reviewsCollectionRef;
    if (vendorId) {
        q = query(q, where('vendorId', '==', vendorId));
    }
    if (serviceId) {
        q = query(q, where('serviceId', '==', serviceId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...(doc.data() as any) })) as Review[];
};

export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
    const newReviewRef = await addDoc(reviewsCollectionRef, { ...reviewData, createdAt: serverTimestamp() });
    const reviewId = newReviewRef.id;

    // Update average rating and review count for vendor and/or service
    await runTransaction(db, async (transaction) => {
        if (reviewData.vendorId) {
            const vendorRef = doc(db, 'vendors', reviewData.vendorId);
            const vendorDoc = await transaction.get(vendorRef);
            if (vendorDoc.exists()) {
                const currentRating = vendorDoc.data().averageRating || 0;
                const currentReviewCount = vendorDoc.data().reviewCount || 0;
                const newReviewCount = currentReviewCount + 1;
                const newAverageRating = (currentRating * currentReviewCount + reviewData.rating) / newReviewCount;
                transaction.update(vendorRef, { averageRating: newAverageRating, reviewCount: newReviewCount });
            }
        }

        if (reviewData.serviceId && reviewData.vendorId) {
            const serviceRef = doc(db, 'vendors', reviewData.vendorId, 'services', reviewData.serviceId);
            const serviceDoc = await transaction.get(serviceRef);
            if (serviceDoc.exists()) {
                const currentRating = serviceDoc.data().averageRating || 0;
                const currentReviewCount = serviceDoc.data().reviewCount || 0;
                const newReviewCount = currentReviewCount + 1;
                const newAverageRating = (currentRating * currentReviewCount + reviewData.rating) / newReviewCount;
                transaction.update(serviceRef, { averageRating: newAverageRating, reviewCount: newReviewCount });
            }
        }
    });

    return reviewId;
};
