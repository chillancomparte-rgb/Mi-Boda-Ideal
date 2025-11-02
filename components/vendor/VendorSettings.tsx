import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Spinner from '../Spinner';

const defaultSettings = {
    notifications: {
        newMessages: true,
        bookingRequests: true,
        reviewAlerts: true,
        monthlySummary: false,
    },
    privacy: {
        showPhoneNumber: true,
        showRealTimeAvailability: false,
    },
};

type Settings = typeof defaultSettings;
type SettingsTab = 'account' | 'notifications' | 'privacy';

const VendorSettings: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const vendorDocRef = doc(db, 'vendors', user.uid);
                const vendorDocSnap = await getDoc(vendorDocRef);
                if (vendorDocSnap.exists() && vendorDocSnap.data().settings) {
                    // Deep merge to ensure new settings from default are included
                    const dbSettings = vendorDocSnap.data().settings;
                    const mergedSettings = {
                        ...defaultSettings,
                        notifications: { ...defaultSettings.notifications, ...dbSettings.notifications },
                        privacy: { ...defaultSettings.privacy, ...dbSettings.privacy },
                    };
                    setSettings(mergedSettings);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [user]);

    const handleSettingsChange = (category: keyof Settings, key: any, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            [category]: { ...prev[category], [key]: value },
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setSuccessMessage('');
        try {
            const vendorDocRef = doc(db, 'vendors', user.uid);
            await updateDoc(vendorDocRef, { settings });
            setSuccessMessage('¡Configuración guardada con éxito!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const renderContent = () => {
        if (isLoading) return <Spinner />;
        switch (activeTab) {
            case 'account':
                return <AccountSettingsTab />;
            case 'notifications':
                return <NotificationSettingsTab settings={settings.notifications} onChange={(key, value) => handleSettingsChange('notifications', key, value)} />;
            case 'privacy':
                return <PrivacySettingsTab settings={settings.privacy} onChange={(key, value) => handleSettingsChange('privacy', key, value)} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Configuración</h3>
            <div className="flex border-b mb-6">
                <TabButton title="Cuenta" isActive={activeTab === 'account'} onClick={() => setActiveTab('account')} />
                <TabButton title="Notificaciones" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                <TabButton title="Privacidad" isActive={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} />
            </div>
            <div>
                {renderContent()}
            </div>
            <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t">
                {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                <button onClick={handleSave} disabled={isSaving || isLoading} className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
};

// --- Tab Components ---

const TabButton: React.FC<{ title: string, isActive: boolean, onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`py-2 px-4 text-sm font-medium ${isActive ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>
        {title}
    </button>
);

const AccountSettingsTab: React.FC = () => (
    <div className="space-y-6 animate-fade-in">
        <h4 className="text-lg font-semibold text-brand-dark">Cambiar Contraseña</h4>
        <div className="max-w-md space-y-4">
            {/* Password change functionality requires Firebase Auth logic and is not implemented here. */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                <input type="password" disabled className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <input type="password" disabled className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                <input type="password" disabled className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
            </div>
            <div className="pt-2">
                <button disabled className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">Guardar Cambios</button>
            </div>
        </div>
    </div>
);

const NotificationSettingsTab: React.FC<{ settings: Settings['notifications'], onChange: (key: keyof Settings['notifications'], value: boolean) => void }> = ({ settings, onChange }) => (
    <div className="space-y-4 animate-fade-in">
        <h4 className="text-lg font-semibold text-brand-dark">Notificaciones por Correo</h4>
        <p className="text-sm text-gray-600">Recibe un correo cuando ocurran estos eventos.</p>
        <ToggleSwitch label="Nuevos mensajes de parejas" isEnabled={settings.newMessages} onToggle={() => onChange('newMessages', !settings.newMessages)} />
        <ToggleSwitch label="Nuevas solicitudes de cotización" isEnabled={settings.bookingRequests} onToggle={() => onChange('bookingRequests', !settings.bookingRequests)} />
        <ToggleSwitch label="Nuevas reseñas de clientes" isEnabled={settings.reviewAlerts} onToggle={() => onChange('reviewAlerts', !settings.reviewAlerts)} />
        <ToggleSwitch label="Resumen mensual de rendimiento" isEnabled={settings.monthlySummary} onToggle={() => onChange('monthlySummary', !settings.monthlySummary)} />
    </div>
);

const PrivacySettingsTab: React.FC<{ settings: Settings['privacy'], onChange: (key: keyof Settings['privacy'], value: boolean) => void }> = ({ settings, onChange }) => (
    <div className="space-y-4 animate-fade-in">
        <h4 className="text-lg font-semibold text-brand-dark">Configuración de Privacidad</h4>
        <ToggleSwitch 
            label="Mostrar mi número de teléfono en mi perfil público"
            isEnabled={settings.showPhoneNumber} 
            onToggle={() => onChange('showPhoneNumber', !settings.showPhoneNumber)} 
        />
        <ToggleSwitch 
            label="Activar calendario de disponibilidad en tiempo real (Premium)"
            isEnabled={settings.showRealTimeAvailability} 
            onToggle={() => onChange('showRealTimeAvailability', !settings.showRealTimeAvailability)} 
            isPremiumFeature={true}
        />
    </div>
);

// --- Reusable Components ---

const ToggleSwitch: React.FC<{ label: string, isEnabled: boolean, onToggle: () => void, isPremiumFeature?: boolean }> = ({ label, isEnabled, onToggle, isPremiumFeature }) => (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
            <span className="text-gray-800 font-medium">{label}</span>
            {isPremiumFeature && <span className="ml-2 text-xs font-bold text-yellow-500 bg-yellow-100 py-0.5 px-2 rounded-full">PREMIUM</span>}
        </div>
        <button 
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-brand-primary' : 'bg-gray-300'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export default VendorSettings;