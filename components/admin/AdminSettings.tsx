import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Spinner from '../Spinner';

const AdminSettings: React.FC = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const settingsDocRef = doc(db, 'site_config', 'main');

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const docSnap = await getDoc(settingsDocRef);
                if (docSnap.exists()) {
                    setIsMaintenanceMode(docSnap.data().isMaintenanceMode || false);
                } else {
                    await setDoc(settingsDocRef, { isMaintenanceMode: false });
                    setIsMaintenanceMode(false);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggleMaintenanceMode = async () => {
        setIsSaving(true);
        const newStatus = !isMaintenanceMode;
        try {
            await setDoc(settingsDocRef, { isMaintenanceMode: newStatus }, { merge: true });
            setIsMaintenanceMode(newStatus);
        } catch (error) {
            console.error("Error updating settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración del Sitio</h1>

            <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-700">Modo Mantenimiento</h2>
                        <p className="text-sm text-gray-500">
                            Cuando está activo, solo los administradores pueden ver el sitio. El resto de los visitantes verá una página de mantenimiento.
                        </p>
                    </div>
                    <div className="flex items-center">
                         {isSaving && <span className="text-sm text-gray-500 mr-4">Guardando...</span>}
                        <label htmlFor="maintenance-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="maintenance-toggle"
                                    className="sr-only"
                                    checked={isMaintenanceMode}
                                    onChange={handleToggleMaintenanceMode}
                                    disabled={isSaving}
                                />
                                <div className={`block w-14 h-8 rounded-full transition ${isMaintenanceMode ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;