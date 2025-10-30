import React, { useState, useMemo, useEffect } from 'react';
import type { Guest } from '../../types';

const initialGuests: Guest[] = [
    { id: 1, name: 'Juan Pérez', group: 'Familia del Novio', status: 'Confirmado', table: 1 },
    { id: 2, name: 'María González', group: 'Familia de la Novia', status: 'Pendiente', table: null },
    { id: 3, name: 'Carlos Soto', group: 'Amigos del Novio', status: 'Confirmado', table: 2 },
    { id: 4, name: 'Ana Morales', group: 'Amigos de la Novia', status: 'Rechazado', table: null },
];

const LOCAL_STORAGE_KEY = 'miBodaIdealGuestList';


const GuestListTool: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>(() => {
        try {
            const savedGuests = localStorage.getItem(LOCAL_STORAGE_KEY);
            return savedGuests ? JSON.parse(savedGuests) : initialGuests;
        } catch (error) {
            return initialGuests;
        }
    });
    
    const [newGuestName, setNewGuestName] = useState('');
    const [newGuestGroup, setNewGuestGroup] = useState('Amigos');

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guests));
    }, [guests]);

    const addGuest = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGuestName.trim() === '') return;
        const newGuest: Guest = {
            id: Date.now(),
            name: newGuestName.trim(),
            group: newGuestGroup,
            status: 'Pendiente',
            table: null,
        };
        setGuests([...guests, newGuest]);
        setNewGuestName('');
    };
    
    const updateGuestStatus = (id: number, status: Guest['status']) => {
        setGuests(guests.map(g => g.id === id ? {...g, status} : g));
    };
    
    const removeGuest = (id: number) => {
        setGuests(guests.filter(g => g.id !== id));
    };

    const summary = useMemo(() => {
        return guests.reduce((acc, guest) => {
            if (guest.status === 'Confirmado') acc.confirmed++;
            else if (guest.status === 'Pendiente') acc.pending++;
            else if (guest.status === 'Rechazado') acc.declined++;
            return acc;
        }, { confirmed: 0, pending: 0, declined: 0 });
    }, [guests]);


    return (
        <div>
            <h2 className="text-2xl font-serif font-bold mb-6 text-brand-dark">Lista de Invitados</h2>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">Total Invitados</p>
                    <p className="text-2xl font-bold text-blue-800">{guests.length}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm text-green-900">Confirmados</p>
                    <p className="text-2xl font-bold text-green-800">{summary.confirmed}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="text-sm text-yellow-900">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-800">{summary.pending}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm text-red-900">Rechazados</p>
                    <p className="text-2xl font-bold text-red-800">{summary.declined}</p>
                </div>
            </div>

            <form onSubmit={addGuest} className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-brand-light rounded-lg">
                <input 
                    type="text" 
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Nombre del invitado" 
                    className="flex-grow p-2 border rounded-md"
                />
                <input 
                    type="text" 
                    value={newGuestGroup}
                    onChange={(e) => setNewGuestGroup(e.target.value)}
                    placeholder="Grupo" 
                    className="flex-grow p-2 border rounded-md"
                />
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-brand-accent">
                    Añadir Invitado
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Nombre</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Grupo</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Estado</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {guests.map(guest => (
                            <tr key={guest.id}>
                                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-brand-dark">{guest.name}</td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm text-brand-dark opacity-80">{guest.group}</td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm">
                                    <select value={guest.status} onChange={e => updateGuestStatus(guest.id, e.target.value as Guest['status'])} className="p-1 border rounded-md">
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Confirmado">Confirmado</option>
                                        <option value="Rechazado">Rechazado</option>
                                    </select>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm">
                                    <button onClick={() => removeGuest(guest.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuestListTool;