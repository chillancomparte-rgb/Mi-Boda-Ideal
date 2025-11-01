import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { XIcon } from '../icons/XIcon';
import { GoogleIcon } from '../icons/GoogleIcon';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView }) => {
    const [view, setView] = useState(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { logIn, signUp } = useAuth();

    React.useEffect(() => {
        setView(initialView);
        setError('');
        setEmail('');
        setPassword('');
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (view === 'login') {
                await logIn(email, password);
            } else {
                await signUp(email, password);
            }
            onClose();
        } catch (err: any) {
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No se encontró un usuario con este correo electrónico.');
                    break;
                case 'auth/wrong-password':
                    setError('La contraseña es incorrecta.');
                    break;
                case 'auth/email-already-in-use':
                    setError('Este correo electrónico ya está en uso.');
                    break;
                 case 'auth/weak-password':
                    setError('La contraseña debe tener al menos 6 caracteres.');
                    break;
                default:
                    setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                    <div className="text-center mb-6">
                         <h2 className="text-2xl font-serif font-bold text-brand-dark">{view === 'login' ? 'Iniciar Sesión' : 'Crear una Cuenta'}</h2>
                         <p className="text-sm text-brand-dark opacity-70 mt-1">
                            {view === 'login' ? '¡Qué bueno verte de nuevo!' : 'Únete para empezar a planificar tu boda.'}
                         </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">Correo Electrónico</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="password"className="block text-sm font-medium text-brand-dark mb-1">Contraseña</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-md" />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        
                        <div className="mt-6">
                            <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent transition-colors disabled:bg-gray-400">
                                {loading ? 'Cargando...' : (view === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">O continúa con</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <GoogleIcon className="h-5 w-5 mr-3" />
                                Google
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-6 text-sm">
                        {view === 'login' ? (
                            <p>¿No tienes una cuenta? <button onClick={() => setView('signup')} className="font-semibold text-brand-primary hover:underline">Regístrate</button></p>
                        ) : (
                             <p>¿Ya tienes una cuenta? <button onClick={() => setView('login')} className="font-semibold text-brand-primary hover:underline">Inicia Sesión</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
