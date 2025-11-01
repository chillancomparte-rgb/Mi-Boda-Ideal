// services/firebase.ts
// FIX: Use named imports from 'firebase/app' for the modular SDK.
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// --- INSTRUCCIONES IMPORTANTES ---
// Para que la aplicación se conecte a tu base de datos de Firebase,
// debes reemplazar los valores de marcador de posición de abajo con las
// credenciales reales de tu proyecto de Firebase.

// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Selecciona tu proyecto (o crea uno nuevo).
// 3. Ve a "Configuración del proyecto" (el ícono de engranaje ⚙️ en la parte superior izquierda).
// 4. En la pestaña "General", desplázate hacia abajo hasta la sección "Tus apps".
// 5. Si aún no tienes una app web, haz clic en el ícono `</>` para crear una.
// 6. Busca el objeto `firebaseConfig` y copia los valores aquí.
// ¡No te preocupes, estas claves son seguras para exponer en el lado del cliente!

const firebaseConfig = {
    apiKey: "AIzaSyAZlZ4WwqCdSwrhmYGldGBEdxMxr4eOn_0",
    authDomain: "mibodaideal-c0a05.firebaseapp.com",
    projectId: "mibodaideal-c0a05",
    storageBucket: "mibodaideal-c0a05.appspot.com",
    messagingSenderId: "10917823148",
    appId: "1:10917823148:web:a562c3da349597b2461509"
};

// --- FIN DE LAS INSTRUCCIONES ---

// Initialize Firebase
// FIX: Call the imported functions directly.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


// Exportamos las instancias de los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);

// Comprobamos si la configuración parece ser la de marcador de posición
if (firebaseConfig.apiKey === "AIzaSyAZlZ4WwqCdSwrhmYGldGBEdxMxr4eOn_0") {
    console.warn("ADVERTENCIA: Estás utilizando la configuración de Firebase de marcador de posición. Por favor, actualiza `services/firebase.ts` con tus propias credenciales para que la aplicación funcione correctamente.");
} else {
     console.log("Firebase connected with provided credentials. Firestore and Auth instances exported.");
}