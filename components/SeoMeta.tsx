import React, { useEffect, useState } from 'react';
import { getGeneralSettings } from '../services/configService';
import { GeneralSettings } from '../types/config';

interface SeoMetaProps {
    title: string;
    description: string;
    imageUrl?: string; // Nueva prop opcional para la imagen
}

const SeoMeta: React.FC<SeoMetaProps> = ({ title, description, imageUrl }) => {
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getGeneralSettings();
            setGeneralSettings(settings);
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const finalTitle = title || generalSettings?.siteName || "Mi Boda Ideal";
        const finalDescription = description || generalSettings?.siteDescription || "Planifica la boda de tus sueños con Mi Boda Ideal.";
        const finalImageUrl = imageUrl || generalSettings?.metaImageUrl || "";

        // Actualizar el título del documento
        document.title = finalTitle;

        // Actualizar la meta descripción
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', finalDescription);

        // Actualizar la meta imagen (Open Graph)
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
        }
        if (finalImageUrl) {
            ogImage.setAttribute('content', finalImageUrl);
        } else {
            ogImage.removeAttribute('content'); // Eliminar si no hay imagen
        }

    }, [title, description, imageUrl, generalSettings]);

    return null; // Este componente no renderiza nada en el DOM
};

export default SeoMeta;
