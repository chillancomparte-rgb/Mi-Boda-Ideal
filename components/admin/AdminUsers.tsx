import React, { useState, useMemo } from 'react';
import type { AdminUser } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { EyeIcon } from '../icons/EyeIcon';

const MOCK_ADMIN_USERS: AdminUser[] = [
    { id: 'u001', name: 'Ana Morales', email: 'ana.morales@email.com', registeredDate: '2023-05-20', weddingDate: '2024-11-16', location: 'Valparaíso' },
    { id: 'u002', name: 'Carlos Soto', email: 'carlos.soto@email.com', registeredDate: '2023-06-11', weddingDate: '2024-12-07', location: 'Metropolitana de Santiago' },
    { id: 'u003', name: 'Laura Jiménez', email: 'laura.j@email.com', registeredDate: '2023-08-01', weddingDate: '2025-03-22', location: 'Biobío' },
    { id: 'u004', name: 'Pedro Pascal', email: 'pedro.p@email.com', registeredDate: '2024-01-05', weddingDate: '2025-01-18', location: 'Metropolitana de Santiago' },
    { id: 'u005', name: 'Isidora Goyenechea', email: 'isi.goye@email.com', registeredDate: '2024-02-01', weddingDate: '2024-10-26', location: 'Metropolitana de Santiago' },
];

const ITEMS_PER_PAGE = 10;

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AdminUser, direction: 'ascending' | 'descending' } | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return users.filter(user =>
            (user.name && user.name.toLowerCase().includes(lowercasedSearchTerm)) ||
            (user.email && user.email.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [searchTerm, users]);

    const sortedUsers = useMemo(() => {
        let sortableItems = [...filteredUsers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredUsers, sortConfig]);

    const paginatedUsers = sortedUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);

    const requestSort = (key: keyof AdminUser) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm bg-gray-100 border-transparent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('name')}>Nombre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('registeredDate')}>Fecha Registro</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('weddingDate')}>Fecha Boda</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registeredDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.weddingDate || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900" title="Ver"><EyeIcon className="h-5 w-5"/></button>
                                        <button className="text-gray-600 hover:text-gray-900 ml-2" title="Editar"><EditIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 ml-2" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="py-3 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, sortedUsers.length)}</span> de <span className="font-medium">{sortedUsers.length}</span> resultados
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;