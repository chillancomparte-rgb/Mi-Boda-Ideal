import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { AdminUser } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import Spinner from '../Spinner';
import { XIcon } from '../icons/XIcon';
import { CHILE_REGIONS } from '../../constants';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { SettingsIcon } from '../icons/SettingsIcon'; // Importa el icono de configuración

type UserRoleFilter = 'all' | 'admin' | 'vendor' | 'user';

interface AdminUserFormData extends Partial<AdminUser> {
    password?: string;
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState<string>('Todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState<AdminUserFormData>({});
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentUserType, setCurrentUserType] = useState<UserRoleFilter>('all');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('role', 'in', ['admin', 'user']));
            const usersSnapshot = await getDocs(q);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminUser[];
            // Asegurarse de que el superadmin siempre tenga el rol 'admin' explícitamente
            const processedUsers = usersList.map(user => {
                if (user.email === 'superadmin@mibodaideal.cl') {
                    return { ...user, role: 'admin' as 'admin' };
                }
                // Si no hay rol explícito, asignar 'user' por defecto o mantener el rol existente si es 'vendor'
                return { ...user, role: (user.role || 'user') as 'admin' | 'user' | 'vendor' };
            });
            setUsers(processedUsers as AdminUser[]);
        } catch (error) {
            console.error("Error fetching users: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user: AdminUser | null = null) => {
        setEditingUser(user);
        // Si se está creando un nuevo usuario, el rol por defecto es 'user'
        setFormData(user ? { ...user } : { name: '', email: '', password: '', location: CHILE_REGIONS[0], weddingDate: '', phone: '', role: 'user' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({});
        setIsUploading(false);
        fetchUsers(); // Refresh the user list when modal closes
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Asegúrate de que 'uploadImageToHosting' esté importado y sea el servicio correcto
            const imageUrl = await uploadImageToHosting(file);
            setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
        } catch (error) {
            alert('Error al subir la imagen. Por favor, revisa la consola para más detalles.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.role) {
            alert("Nombre, email y rol son requeridos.");
            return;
        }

        setIsLoading(true);
        try {
            if (editingUser) {
                // Update
                // Solo se puede cambiar el rol a 'admin' si el usuario que edita es superadmin
                if (editingUser.email === 'superadmin@mibodaideal.cl' && formData.role !== 'admin') {
                    alert("No puedes cambiar el rol del superadmin.");
                    setIsLoading(false);
                    return;
                }
                const userDoc = doc(db, 'users', editingUser.id);
                const { password, ...dataToUpdate } = formData;
                await updateDoc(userDoc, dataToUpdate as Partial<AdminUser>);
            } else {
                // Create new user
                if (!formData.password) {
                    alert("La contraseña es requerida para nuevos usuarios.");
                    setIsLoading(false);
                    return;
                }
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                    const firebaseUser = userCredential.user;

                    await setDoc(doc(db, 'users', firebaseUser.uid), {
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: formData.name,
                        role: formData.role || 'user',
                        registeredDate: new Date().toISOString(),
                        location: formData.location || CHILE_REGIONS[0],
                        weddingDate: formData.weddingDate || '',
                        phone: formData.phone || '',
                        avatarUrl: formData.avatarUrl || null,
                        registrationType: 'email',
                    });
                } catch (authError: any) {
                    console.error("Error creating user in Firebase Auth:", authError);
                    alert(`Error al crear usuario en autenticación: ${authError.message}`);
                    setIsLoading(false);
                    return;
                }
            }
            fetchUsers();
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving user: ", error);
            alert(`Ocurrió un error al guardar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const regionMatch = regionFilter === 'Todas' || user.location === regionFilter;
            const roleMatch = currentUserType === 'all' || user.role === currentUserType;
            return searchMatch && regionMatch && roleMatch;
        });
    }, [users, searchTerm, regionFilter, currentUserType]);

    const handleDelete = async (id: string, userEmail: string) => {
        if (userEmail === 'superadmin@mibodaideal.cl') {
            alert("No se puede eliminar el usuario superadmin.");
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            const userDoc = doc(db, 'users', id);
            try {
                await deleteDoc(userDoc);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error("Error deleting user: ", error);
            }
        }
    };

    const handlePasswordReset = async (email: string) => {
        if (window.confirm(`¿Estás seguro de que quieres enviar un correo de restablecimiento de contraseña a ${email}?`)) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert(`Correo de restablecimiento de contraseña enviado a ${email}.`);
            } catch (error) {
                console.error("Error sending password reset email: ", error);
                alert(`Error al enviar el correo de restablecimiento: ${(error as Error).message}`);
            }
        }
    };

    const searchInputStyle = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";
    const modalInputStyle = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";
    
    return (
        <div className="bg-white p-6 rounded-lg shadow animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Usuarios</h1>
                <button onClick={() => handleOpenModal()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent flex items-center">
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Añadir Usuario
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setCurrentUserType('all')}
                    className={`px-4 py-2 rounded-md ${currentUserType === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setCurrentUserType('admin')}
                    className={`px-4 py-2 rounded-md ${currentUserType === 'admin' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Administradores
                </button>

                <button 
                    onClick={() => setCurrentUserType('user')}
                    className={`px-4 py-2 rounded-md ${currentUserType === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    Clientes
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center md:items-end">
                <div className="w-full md:flex-grow">
                    <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre o email
                    </label>
                    <input
                        id="userSearch"
                        type="text"
                        placeholder="Escribe para buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={searchInputStyle}
                    />
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="regionFilter" className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por Región
                    </label>
                    <select
                        id="regionFilter"
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className={`${searchInputStyle} md:w-64`}
                    >
                        <option value="Todas">Todas las regiones</option>
                        {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                </div>
            </div>

            {isLoading ? <Spinner /> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Boda</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Registro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl || 'https://via.placeholder.com/150'} alt={user.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === 'admin' ? 'N/A' : (user.phone || 'No ingresado')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role || 'user'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.registeredDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role !== 'user' ? 'N/A' : (user.weddingDate ? new Date(user.weddingDate).toLocaleDateString() : 'No definida')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {user.role !== 'user' ? 'N/A' : (user.registrationType || 'email')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => handlePasswordReset(user.email)} className="text-gray-400 hover:text-orange-500" title="Restablecer Contraseña">
                                                <SettingsIcon className="h-5 w-5"/>
                                            </button>
                                            <button onClick={() => handleOpenModal(user)} className="text-gray-400 hover:text-blue-600" title="Editar Usuario">
                                                <EditIcon className="h-5 w-5"/>
                                            </button>
                                            <button onClick={() => handleDelete(user.id, user.email)} className="text-gray-400 hover:text-red-700" title="Eliminar Usuario">
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
             {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingUser ? 'Editar Usuario' : 'Añadir Usuario'}</h2>
                            <button onClick={handleCloseModal}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                </div>
                                {!editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                        <input type="password" name="password" value={formData.password || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                                    <select name="role" value={formData.role || 'user'} onChange={handleFormChange} className={modalInputStyle} required>
                                        <option value="user">Cliente</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                { (formData.role === 'vendor' || formData.role === 'user') && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
                                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleFormChange} className={modalInputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                                            <select name="location" value={formData.location || ''} onChange={handleFormChange} className={modalInputStyle}>
                                                {CHILE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                                { formData.role === 'user' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fecha de Boda (opcional)</label>
                                        <input type="date" name="weddingDate" value={formData.weddingDate || ''} onChange={handleFormChange} className={modalInputStyle} />
                                    </div>
                                )}
                                { (formData.role === 'vendor' || formData.role === 'user') && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Avatar del Usuario</label>
                                        <div className="mt-1 flex items-center gap-4">
                                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center">
                                                {isUploading ? <Spinner /> : <><UploadCloudIcon className="h-5 w-5 mr-2"/> Subir Avatar</>}
                                            </button>
                                        </div>
                                        {formData.avatarUrl && <img src={formData.avatarUrl} alt="Preview" className="mt-4 w-32 h-32 rounded-full object-cover" />}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" disabled={isUploading} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;