import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { HeroSlide } from '../../types';
import Spinner from '../Spinner';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { XIcon } from '../icons/XIcon';
import { v4 as uuidv4 } from 'uuid';


const AdminHeroSlider: React.FC = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [formData, setFormData] = useState<Partial<HeroSlide>>({});

    const sliderDocRef = doc(db, 'site_config', 'hero_slider');

    const fetchSlides = async () => {
        setIsLoading(true);
        try {
            const docSnap = await getDoc(sliderDocRef);
            if (docSnap.exists() && Array.isArray(docSnap.data().slides)) {
                setSlides(docSnap.data().slides);
            }
        } catch (error) {
            console.error("Error fetching slides:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleOpenModal = (slide: HeroSlide | null = null) => {
        setEditingSlide(slide);
        setFormData(slide ? { ...slide } : { title: '', subtitle: '', imageUrl: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
        setFormData({});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const saveSlides = async (updatedSlides: HeroSlide[]) => {
        try {
            await updateDoc(sliderDocRef, { slides: updatedSlides });
            setSlides(updatedSlides);
        } catch (error) {
            console.error("Error saving slides:", error);
            alert("Ocurrió un error al guardar los cambios.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl) {
            alert("Título y URL de la imagen son requeridos.");
            return;
        }

        let updatedSlides;
        if (editingSlide) {
            // Update existing slide
            updatedSlides = slides.map(s => s.id === editingSlide.id ? { ...s, ...formData } as HeroSlide : s);
        } else {
            // Create new slide
            const newSlide: HeroSlide = { ...formData, id: uuidv4() } as HeroSlide;
            updatedSlides = [...slides, newSlide];
        }
        await saveSlides(updatedSlides);
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Seguro que quieres eliminar este slide?')) {
            const updatedSlides = slides.filter(s => s.id !== id);
            await saveSlides(updatedSlides);
        }
    };
    
    const modalInputStyle = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";

    if (isLoading) return <Spinner />;

    return (
        <div className="bg-white p-6 rounded-lg shadow animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Hero Principal</h1>
                 <button onClick={() => handleOpenModal()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent flex items-center">
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Añadir Slide
                </button>
            </div>

            <div className="space-y-4">
                {slides.map(slide => (
                    <div key={slide.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={slide.imageUrl} alt={slide.title} className="w-24 h-16 object-cover rounded-md"/>
                            <div>
                                <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                                <p className="text-sm text-gray-500 truncate max-w-md">{slide.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleOpenModal(slide)} className="text-gray-400 hover:text-blue-600" title="Editar"><EditIcon className="h-5 w-5"/></button>
                            <button onClick={() => handleDelete(slide.id)} className="text-gray-400 hover:text-red-700" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                ))}
                 {slides.length === 0 && <p className="text-gray-500 text-center py-4">No hay slides. ¡Añade uno para empezar!</p>}
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingSlide ? 'Editar Slide' : 'Añadir Slide'}</h2>
                            <button onClick={handleCloseModal}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Título</label>
                                    <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subtítulo</label>
                                    <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleFormChange} className={modalInputStyle} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
                                    <input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                </div>
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

export default AdminHeroSlider;
