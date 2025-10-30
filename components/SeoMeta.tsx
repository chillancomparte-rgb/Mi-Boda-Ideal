import React, { useEffect } from 'react';

interface SeoMetaProps {
    title: string;
    description: string;
}

const SeoMeta: React.FC<SeoMetaProps> = ({ title, description }) => {
    useEffect(() => {
        // Actualizar el título del documento
        document.title = title;

        // Actualizar la meta descripción
        const metaDescription = document.querySelector('#meta-description');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            const newMeta = document.createElement('meta');
            newMeta.id = 'meta-description';
            newMeta.name = 'description';
            newMeta.content = description;
            document.head.appendChild(newMeta);
        }

    }, [title, description]);

    return null; // Este componente no renderiza nada en el DOM
};

export default SeoMeta;
