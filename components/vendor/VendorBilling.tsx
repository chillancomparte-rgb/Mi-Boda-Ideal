import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { EditIcon } from '../icons/EditIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import { CrownIcon } from '../icons/CrownIcon';
import Spinner from '../Spinner';

// Mock Data for a premium user
const subscription = {
    plan: 'Premium Anual',
    status: 'Activo',
    renewalDate: '15 de Diciembre, 2025',
    price: 299990,
};

const paymentHistory = [
    { id: 'INV-2024-001', date: '15 de Diciembre, 2024', amount: 299990, status: 'Pagado' },
    { id: 'INV-2023-001', date: '15 de Diciembre, 2023', amount: 249990, status: 'Pagado' },
];

const paymentMethod = {
    type: 'Visa',
    last4: '4242',
    expiry: '12/26',
};

const VendorBilling: React.FC = () => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            try {
                // This assumes the vendor ID is the same as the user UID
                // You might need to adjust this based on your data structure
                const vendorDocRef = doc(db, 'vendors', user.uid);
                const vendorDocSnap = await getDoc(vendorDocRef);
                if (vendorDocSnap.exists() && vendorDocSnap.data().isPremium) {
                    setIsPremium(true);
                }
            } catch (error) {
                console.error("Error checking premium status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkPremiumStatus();
    }, [user]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!isPremium) {
        return <UpgradeToPremiumView />;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm space-y-10">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Facturación</h3>

            {/* Subscription Plan Section */}
            <section>
                <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Mi Plan</h4>
                <div className="bg-gray-50 rounded-lg p-6 flex justify-between items-center">
                    <div>
                        <p className="text-xl font-bold text-brand-primary">{subscription.plan}</p>
                        <p className="text-gray-600">Estado: <span className={`font-semibold ${subscription.status === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>{subscription.status}</span></p>
                        <p className="text-gray-600">Próxima renovación: {subscription.renewalDate}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-brand-dark">${subscription.price.toLocaleString('es-CL')} <span className="text-base font-normal text-gray-500">/año</span></p>
                        <button className="mt-2 text-sm text-brand-primary hover:underline">Administrar Suscripción</button>
                    </div>
                </div>
            </section>

            {/* Payment History Section */}
            <section>
                <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Historial de Pagos</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Factura</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paymentHistory.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${payment.amount.toLocaleString('es-CL')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-brand-primary hover:text-brand-accent p-2">
                                            <DownloadIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Payment Method Section */}
            <section>
                <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Método de Pago</h4>
                <div className="bg-gray-50 rounded-lg p-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={`https://www.svgrepo.com/show/362037/visa.svg`} alt="Visa Logo" className="h-8 mr-4"/>
                        <div>
                            <p className="font-semibold text-gray-800">{paymentMethod.type} terminada en {paymentMethod.last4}</p>
                            <p className="text-sm text-gray-600">Expira: {paymentMethod.expiry}</p>
                        </div>
                    </div>
                    <button className="flex items-center text-brand-primary hover:text-brand-accent">
                        <EditIcon className="h-5 w-5 mr-2" />
                        Actualizar
                    </button>
                </div>
            </section>
        </div>
    );
};

const UpgradeToPremiumView: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="max-w-md mx-auto">
            <CrownIcon className="h-16 w-16 mx-auto text-yellow-400" />
            <h3 className="text-2xl font-serif font-bold text-brand-dark mt-4 mb-2">Desbloquea todo tu Potencial con Premium</h3>
            <p className="text-gray-600 mb-6">
                Accede a herramientas avanzadas, mayor visibilidad y recursos exclusivos para hacer crecer tu negocio de bodas.
            </p>
            <button className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-accent transition-colors w-full">
                Actualizar a Premium
            </button>
            <p className="text-xs text-gray-500 mt-3">* La integración con pasarelas de pago es necesaria para la funcionalidad completa.</p>
        </div>
    </div>
);

export default VendorBilling;