import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GeneralSettings } from '../types/config';

const SETTINGS_DOC_REF = doc(db, 'settings', 'general');

export const getGeneralSettings = async (): Promise<GeneralSettings | null> => {
    try {
        const docSnap = await getDoc(SETTINGS_DOC_REF);
        if (docSnap.exists()) {
            return docSnap.data() as GeneralSettings;
        }
        return null;
    } catch (error) {
        console.error("Error fetching general settings:", error);
        return null;
    }
};

export const updateGeneralSettings = async (settings: Partial<GeneralSettings>): Promise<void> => {
    try {
        await setDoc(SETTINGS_DOC_REF, settings, { merge: true });
        console.log("General settings updated successfully.");
    } catch (error) {
        console.error("Error updating general settings:", error);
        throw error;
    }
};

export const initializeDefaultSettings = async () => {
    const settings = await getGeneralSettings();
    if (!settings) {
        const defaultSettings: GeneralSettings = {
            siteName: "Mi Boda Ideal",
            siteDescription: "Planifica la boda de tus sueños con Mi Boda Ideal.",
            metaImageUrl: "", // Placeholder, should be a URL to a default image
            maintenanceMode: false,
            generalAnnouncement: "",
            vendorAnnouncement: "",
            clientAnnouncement: "",
        };
        await setDoc(SETTINGS_DOC_REF, defaultSettings);
        console.log("Default general settings initialized.");
    }
};