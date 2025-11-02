import React, { useState, useEffect } from 'react';
import { getGeneralSettings, updateGeneralSettings, initializeDefaultSettings } from '../../services/configService';
import { GeneralSettings } from '@types/config';
import Spinner from '../Spinner';

const AdminSettingsGeneral: React.FC = () => {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            await initializeDefaultSettings(); // Ensure defaults are set if not present
            const currentSettings = await getGeneralSettings();
            setSettings(currentSettings);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setSettings((prev: GeneralSettings) => ({
            ...prev!,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setIsSaving(true);
        setMessage(null);
        try {
            await updateGeneralSettings(settings);
            setMessage({ type: 'success', text: 'Configuración guardada exitosamente.' });
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage({ type: 'error', text: 'Error al guardar la configuración.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (!settings) {
        return <div className="text-center text-red-500">Error: No se pudieron cargar las configuraciones.</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Configuración del Sitio</h2>

            {message && (
                <div className={`p-3 mb-4 rounded-md text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
                    <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Descripción del Sitio (SEO)</label>
                    <textarea
                        id="siteDescription"
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="metaImageUrl" className="block text-sm font-medium text-gray-700">URL de Imagen para Meta Tags</label>
                    <input
                        type="url"
                        id="metaImageUrl"
                        name="metaImageUrl"
                        value={settings.metaImageUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {settings.metaImageUrl && <img src={settings.metaImageUrl} alt="Meta Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />}
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="maintenanceMode"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleChange}
                        className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-sm font-medium text-gray-700">Modo Mantenimiento</label>
                </div>
                <div>
                    <label htmlFor="generalAnnouncement" className="block text-sm font-medium text-gray-700">Anuncio General (visible para todos)</label>
                    <textarea
                        id="generalAnnouncement"
                        name="generalAnnouncement"
                        value={settings.generalAnnouncement}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="vendorAnnouncement" className="block text-sm font-medium text-gray-700">Anuncio para Proveedores</label>
                    <textarea
                        id="vendorAnnouncement"
                        name="vendorAnnouncement"
                        value={settings.vendorAnnouncement}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="clientAnnouncement" className="block text-sm font-medium text-gray-700">Anuncio para Clientes</label>
                    <textarea
                        id="clientAnnouncement"
                        name="clientAnnouncement"
                        value={settings.clientAnnouncement}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsGeneral;
