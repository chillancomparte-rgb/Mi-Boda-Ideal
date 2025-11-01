import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import type { RealWedding, Inspiration } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import Spinner from '../Spinner';
import { XIcon } from '../icons/XIcon';

type Tab = 'weddings' | 'articles';

type ModalState = {
    isOpen: boolean;
    type: Tab;
    item: RealWedding | Inspiration | null;
};

const AdminContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('weddings');
    const [realWeddings, setRealWeddings] = useState<RealWedding[]>([]);
    const [articles, setArticles] = useState<Inspiration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: 'weddings', item: null });
    const [formData, setFormData] = useState<Partial<RealWedding & Inspiration>>({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const weddingsCollection = collection(db, 'realWeddings');
            const articlesCollection = collection(db, 'articles');
            
            const weddingsSnapshot = await getDocs(weddingsCollection);
            const articlesSnapshot = await getDocs(articlesCollection);

            setRealWeddings(weddingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RealWedding[]);
            setArticles(articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Inspiration[]);
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (type: Tab, item: RealWedding | Inspiration | null = null) => {
        setModalState({ isOpen: true, type, item });
        if (item) {
            setFormData(item);
        } else {
            setFormData(type === 'weddings' 
                ? { name: '', location: '', photos: [] } 
                : { title: '', category: '', description: '', imageSearchTerms: '' });
        }
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, type: 'weddings', item: null });
        setFormData({});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'photos') {
            setFormData({ ...formData, [name]: value.split(',').map(s => s.trim()) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const collectionName = modalState.type === 'weddings' ? 'realWeddings' : 'articles';

        try {
            if (modalState.item) {
                // Update
                const itemDoc = doc(db, collectionName, modalState.item.id);
                await updateDoc(itemDoc, formData);
            } else {
                // Create
                await addDoc(collection(db, collectionName), formData);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error(`Error saving to ${collectionName}:`, error);
        }
    };

    const handleDelete = async (id: string, type: Tab) => {
        const collectionName = type === 'weddings' ? 'realWeddings' : 'articles';
        if (window.confirm(`¿Estás seguro de que quieres eliminar este elemento de ${collectionName}?`)) {
            try {
                await deleteDoc(doc(db, collectionName, id));
                fetchData(); // Refrescar los datos
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    // AI functionality
    const [topic, setTopic] = useState('');
    const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiError, setAIError] = useState('');
    
    const handleGenerateIdeas = async () => {
        if (!topic.trim()) {
            setAIError('Por favor, ingresa un tema.');
            return;
        }
        setIsAILoading(true);
        setAIError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate 5 blog post titles for a wedding website about: "${topic}". In Spanish.`,
            });
            const text = response.text;
            setGeneratedIdeas(text.split('\n').filter(Boolean).map(line => line.replace(/^\d+\.\s*/, '')));
        } catch (err) {
            setAIError("Error al contactar la IA.");
            console.error(err);
        } finally {
            setIsAILoading(false);
        }
    };

    const renderModalForm = () => {
        if (modalState.type === 'weddings') {
            const weddingData = formData as Partial<RealWedding>;
            return (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombres Pareja</label>
                        <input type="text" name="name" value={weddingData.name || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <input type="text" name="location" value={weddingData.location || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fotos (URLs separadas por comas)</label>
                        <textarea name="photos" value={Array.isArray(weddingData.photos) ? weddingData.photos.join(', ') : ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" rows={3}></textarea>
                    </div>
                </>
            );
        } else { // articles
            const articleData = formData as Partial<Inspiration>;
            return (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input type="text" name="title" value={articleData.title || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <input type="text" name="category" value={articleData.category || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea name="description" value={articleData.description || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" rows={3} required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Términos de búsqueda de imagen (para Unsplash)</label>
                        <input type="text" name="imageSearchTerms" value={articleData.imageSearchTerms || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary" required />
                    </div>
                </>
            );
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestor de Contenido y Artículos</h1>
                <p className="text-gray-600">Administra los "Matrimonios Reales" y los "Artículos de Inspiración" de la plataforma.</p>

                <div className="border-b border-gray-200 mt-4">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('weddings')} className={`${activeTab === 'weddings' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Matrimonios Reales
                        </button>
                        <button onClick={() => setActiveTab('articles')} className={`${activeTab === 'articles' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Artículos de Inspiración
                        </button>
                    </nav>
                </div>
                
                <div className="mt-6">
                    {isLoading ? <Spinner /> : (
                        <>
                            {activeTab === 'weddings' && (
                                <ContentTable title="Matrimonios Reales" data={realWeddings} type="weddings" onDelete={handleDelete} onEdit={(item) => handleOpenModal('weddings', item)} onAdd={() => handleOpenModal('weddings')} />
                            )}
                            {activeTab === 'articles' && (
                                <ContentTable title="Artículos de Inspiración" data={articles} type="articles" onDelete={handleDelete} onEdit={(item) => handleOpenModal('articles', item)} onAdd={() => handleOpenModal('articles')} />
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-lg font-semibold text-brand-dark mb-3 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-brand-primary" />
                    Generador de Ideas para Artículos
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej: Decoración rústica" className="flex-grow p-3 border rounded-md" />
                    <button onClick={handleGenerateIdeas} disabled={isAILoading} className="bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                        {isAILoading ? 'Generando...' : 'Generar Ideas'}
                    </button>
                </div>
                {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
                {generatedIdeas.length > 0 && (
                     <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <h3 className="font-semibold text-brand-dark mb-2">Ideas:</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {generatedIdeas.map((idea, index) => <li key={index} className="text-gray-700">{idea}</li>)}
                        </ul>
                    </div>
                )}
            </div>
            
            {modalState.isOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                         <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{modalState.item ? 'Editar' : 'Añadir'} {modalState.type === 'weddings' ? 'Matrimonio Real' : 'Artículo'}</h2>
                            <button onClick={handleCloseModal}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                               {renderModalForm()}
                            </div>
                            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent">Guardar</button>
                            </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

interface ContentTableProps {
    title: string;
    data: (RealWedding | Inspiration)[];
    type: Tab;
    onDelete: (id: string, type: Tab) => void;
    onEdit: (item: RealWedding | Inspiration) => void;
    onAdd: () => void;
}

const ContentTable: React.FC<ContentTableProps> = ({ title, data, type, onDelete, onEdit, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            <button onClick={onAdd} className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 flex items-center">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Añadir Nuevo
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{type === 'weddings' ? 'Nombres' : 'Título'}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{type === 'weddings' ? 'Ubicación' : 'Categoría'}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {'name' in item ? item.name : item.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {'location' in item ? item.location : item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => onEdit(item)} className="text-gray-400 hover:text-blue-600" title="Editar"><EditIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onDelete(item.id, type)} className="text-gray-400 hover:text-red-700" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminContent;