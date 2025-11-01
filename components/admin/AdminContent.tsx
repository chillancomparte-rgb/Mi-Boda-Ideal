import React, { useState } from 'react';
import { MOCK_REAL_WEDDINGS, MOCK_ARTICLES } from '../../constants';
import { EyeIcon } from '../icons/EyeIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

type ContentTab = 'weddings' | 'articles';

const AdminContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ContentTab>('weddings');

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Contenido</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('weddings')}
                            className={`${activeTab === 'weddings' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Matrimonios Reales
                        </button>
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`${activeTab === 'articles' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Artículos de Inspiración
                        </button>
                    </nav>
                </div>
                
                <div className="mt-6">
                    {activeTab === 'weddings' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                 <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Pareja</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {MOCK_REAL_WEDDINGS.map(wedding => (
                                        <tr key={wedding.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{wedding.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wedding.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900" title="Ver"><EyeIcon className="h-5 w-5"/></button>
                                                <button className="text-gray-600 hover:text-gray-900 ml-2" title="Editar"><EditIcon className="h-5 w-5"/></button>
                                                <button className="text-red-600 hover:text-red-900 ml-2" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === 'articles' && (
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200">
                                 <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {MOCK_ARTICLES.map(article => (
                                        <tr key={article.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{article.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900" title="Ver"><EyeIcon className="h-5 w-5"/></button>
                                                <button className="text-gray-600 hover:text-gray-900 ml-2" title="Editar"><EditIcon className="h-5 w-5"/></button>
                                                <button className="text-red-600 hover:text-red-900 ml-2" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminContent;
