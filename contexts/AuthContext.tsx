import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { auth, db } from '../services/firebase';
// FIX: Importamos todo lo que Firebase necesita
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit, updateDoc } from 'firebase/firestore';

// --- DEFINICIÓN DE TIPOS (AQUÍ MISMO) ---
// En lugar de un types.ts, lo ponemos todo aquí para estar seguros.

// FIX: Añadimos 'registrationType' y todas las propiedades que usas
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'vendor' | 'user';
  registrationType?: 'google' | 'email'; // <-- ARREGLO PARA EL ERROR TS2353
  
  // Propiedades opcionales que también usas al crear usuarios:
  id?: string;
  name?: string;
  registeredDate?: string;
  location?: string;
  avatarUrl?: string;
}

// FIX: Añadimos las funciones que faltaban (signUp, logIn, logOut, signInWithGoogle)
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
  signInWithGoogle: (role: 'user' | 'vendor') => Promise<any>; // <-- ARREGLO PARA EL ERROR TS2339
}

// Props para el componente AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// --- CREACIÓN DEL CONTEXTO ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- COMPONENTE PROVIDER ---
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser && firebaseUser.email) {
                let finalRole: User['role'];
                let finalDisplayName = firebaseUser.displayName;

                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const vendorsQuery = query(collection(db, 'vendors'), where("email", "==", firebaseUser.email), limit(1));
                
                const [userDocSnap, vendorSnapshot] = await Promise.all([
                    getDoc(userDocRef),
                    getDocs(vendorsQuery)
                ]);

                if (userDocSnap.exists()) {
                    finalDisplayName = userDocSnap.data().name || finalDisplayName;
                }

                if (firebaseUser.email === 'superadmin@mibodaideal.cl') {
                    finalRole = 'admin';
                } else if (!vendorSnapshot.empty) {
                    finalRole = 'vendor';
                } else if (userDocSnap.exists()) {
                    finalRole = userDocSnap.data().role || 'user';
                } else {
                    finalRole = 'user';
                }
                
                const appUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: finalDisplayName,
                    role: finalRole,
                    // Este ya no dará error porque 'registrationType' está en la interface User
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
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
            role: 'user', 
            registeredDate: new Date().toISOString(),
            location: 'Desconocida', 
            registrationType: 'email',
            avatarUrl: null, // Agregado para consistencia
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
        const provider = new GoogleAuthProvider(); // <--- Esto ya no da error
        try {
            const result = await signInWithPopup(auth, provider); // <--- Esto ya no da error
            const firebaseUser = result.user;
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
                    role: role,
                    registeredDate: new Date().toISOString(),
                    location: 'Desconocida',
                    avatarUrl: firebaseUser.photoURL,
                    registrationType: 'google',
                });
            } else {
                // Si ya existe, solo actualizamos el tipo de registro (o lo que necesites)
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
        signInWithGoogle, // <--- Esto ya no da error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// --- CUSTOM HOOK (para usarlo en otros archivos) ---
// Esto te permite usar 'useAuth()' en lugar de 'useContext(AuthContext)'
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};