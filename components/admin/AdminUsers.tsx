import React, { useState, useMemo, useEffect } from 'react';
import type { AdminUser } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import Spinner from '../Spinner';
import { XIcon } from '../icons/XIcon';
import { CHILE_REGIONS } from '../../constants';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [regionFilter, setRegionFilter] = useState<string>('Todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState<Partial<AdminUser>>({});

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminUser[];
            setUsers(usersList);
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
        setFormData(user ? { ...user } : { name: '', email: '', location: CHILE_REGIONS[0], weddingDate: '', phone: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert("Nombre y email son requeridos.");
            return;
        }

        try {
            if (editingUser) {
                // Update
                const userDoc = doc(db, 'users', editingUser.id);
                await updateDoc(userDoc, formData);
            } else {
                // Create
                await addDoc(collection(db, 'users'), { ...formData, registeredDate: new Date().toISOString() });
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving user: ", error);
            alert("Ocurrió un error al guardar.");
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const regionMatch = regionFilter === 'Todas' || user.location === regionFilter;
            return searchMatch && regionMatch;
        });
    }, [users, searchTerm, regionFilter]);

    const handleDelete = async (id: string) => {
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Boda</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || 'No ingresado'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.registeredDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.weddingDate ? new Date(user.weddingDate).toLocaleDateString() : 'No definida'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => handleOpenModal(user)} className="text-gray-400 hover:text-blue-600" title="Editar Usuario">
                                                <EditIcon className="h-5 w-5"/>
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-700" title="Eliminar Usuario">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de Boda (opcional)</label>
                                    <input type="date" name="weddingDate" value={formData.weddingDate || ''} onChange={handleFormChange} className={modalInputStyle} />
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;