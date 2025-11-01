import React from 'react';

const VendorCampus: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">Campus Premium</h3>
            <p className="text-gray-600">
                ¡Bienvenido a la zona de crecimiento! Aquí encontrarás recursos exclusivos para profesionales de bodas premium. Accede a artículos, webinars y
                consejos de expertos para mejorar tu negocio y destacar en el mercado.
            </p>
            {/* Aquí iría el listado de cursos, webinars, etc. */}
        </div>
    );
};

export default VendorCampus;