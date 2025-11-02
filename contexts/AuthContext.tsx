import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit, updateDoc } from 'firebase/firestore';
import type { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser && firebaseUser.email) {
                let finalRole: User['role'];
                let finalDisplayName = firebaseUser.displayName;

                // Fetch user and vendor data in parallel for efficiency
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const vendorsQuery = query(collection(db, 'vendors'), where("email", "==", firebaseUser.email), limit(1));
                
                const [userDocSnap, vendorSnapshot] = await Promise.all([
                    getDoc(userDocRef),
                    getDocs(vendorsQuery)
                ]);

                // Determine display name from the user's document if it exists
                if (userDocSnap.exists()) {
                    finalDisplayName = userDocSnap.data().name || finalDisplayName;
                }

                // Determine role with a strict priority system
                if (firebaseUser.email === 'superadmin@mibodaideal.cl') {
                    finalRole = 'admin'; // 1. Highest priority: Superadmin
                } else if (!vendorSnapshot.empty) {
                    finalRole = 'vendor'; // 2. Second priority: Vendor
                } else if (userDocSnap.exists()) {
                    finalRole = userDocSnap.data().role || 'user'; // 3. Fallback to user doc
                } else {
                    finalRole = 'user'; // 4. Ultimate fallback for new users
                }
                
                const appUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: finalDisplayName,
                    role: finalRole,
                    registrationType: userDocSnap.exists() ? userDocSnap.data().registrationType : (firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'),
                };
                
                setUser(appUser);

            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
            role: 'user', // Default role for new signups
            registeredDate: new Date().toISOString(),
            location: 'Desconocida', // Default location
            registrationType: 'email',
        });
        
        return userCredential;
    };

    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth);
    };

    const signInWithGoogle = async (role: 'user' | 'vendor') => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // New user, create document
                await setDoc(userDocRef, {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
                    role: role, // Set role based on where they signed up
                    registeredDate: new Date().toISOString(),
                    location: 'Desconocida',
                    avatarUrl: firebaseUser.photoURL,
                    registrationType: 'google',
                });
            } else {
                // Existing user, update if necessary (e.g., role if they signed up as vendor later)
                // For simplicity, we'll just ensure registrationType is set
                await updateDoc(userDocRef, { registrationType: 'google' });
            }
            return result;
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        signUp,
        logIn,
        logOut,
        signInWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};