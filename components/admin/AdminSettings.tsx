import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Spinner from '../Spinner';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';

const AdminSettings: React.FC = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const settingsDocRef = doc(db, 'site_config', 'main');

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const docSnap = await getDoc(settingsDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setIsMaintenanceMode(data.isMaintenanceMode || false);
                    setLogoUrl(data.logoUrl || '');
                } else {
                    const initialSettings = { isMaintenanceMode: false, logoUrl: '' };
                    await setDoc(settingsDocRef, initialSettings);
                    setIsMaintenanceMode(initialSettings.isMaintenanceMode);
                    setLogoUrl(initialSettings.logoUrl);
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadedUrl = await uploadImageToHosting(file);
            setLogoUrl(uploadedUrl);
        } catch (error) {
            alert('Error al subir la imagen. Por favor, revisa la consola para más detalles.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveLogo = async () => {
        setIsSaving(true);
        try {
            await setDoc(settingsDocRef, { logoUrl }, { merge: true });
            alert('Logo actualizado correctamente.');
        } catch (error) {
            console.error("Error saving logo:", error);
            alert('Error al guardar el logo.');
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

            <div className="border rounded-lg p-4 mt-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-700">Logo del Sitio</h2>
                        <p className="text-sm text-gray-500">
                            Sube el logo principal que se mostrará en la cabecera y otras partes del sitio.
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-4">
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center">
                            {isUploading ? <Spinner size="sm" /> : <><UploadCloudIcon className="h-5 w-5 mr-2"/> Cambiar Logo</>}
                        </button>
                        {logoUrl && <img src={logoUrl} alt="Logo del sitio" className="h-16 w-auto rounded-md bg-gray-100 p-1" />}
                    </div>
                    <button onClick={handleSaveLogo} disabled={isSaving || !logoUrl} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                        {isSaving ? 'Guardando...' : 'Guardar Logo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;