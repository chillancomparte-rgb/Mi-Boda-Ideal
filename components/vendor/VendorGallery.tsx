import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, query, collection, where, getDocs, limit } from 'firebase/firestore';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import Spinner from '../Spinner';
import { TrashIcon } from '../icons/TrashIcon';

import { CameraIcon } from '../icons/CameraIcon';

const GalleryBanner = () => (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg overflow-hidden p-8 mb-8">
        <div className="relative z-10">
            <h4 className="text-2xl font-bold text-white">Muestra tu Mejor Trabajo</h4>
            <p className="text-gray-300 mt-2 max-w-2xl">Una galería impresionante es tu mejor carta de presentación. Sube imágenes de alta calidad que capturen la esencia de tu servicio y enamoren a las parejas.</p>
        </div>
    </div>
);

const VendorGallery: React.FC = () => {
    const { user } = useAuth();
    const [gallery, setGallery] = useState<string[]>([]);
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchVendorData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const vendorsQuery = query(collection(db, 'vendors'), where("uid", "==", user.uid), limit(1));
                const vendorSnapshot = await getDocs(vendorsQuery);
                if (!vendorSnapshot.empty) {
                    const vendorDoc = vendorSnapshot.docs[0];
                    setVendorId(vendorDoc.id);
                    setGallery(vendorDoc.data().gallery || []);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVendorData();
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!vendorId) return;
        setIsUploading(true);
        setUploadProgress(0);
        try {
            const imageUrl = await uploadImageToHosting(file);
            const updatedGallery = [...gallery, imageUrl];
            setGallery(updatedGallery);

            const vendorDocRef = doc(db, 'vendors', vendorId);
            await updateDoc(vendorDocRef, { gallery: updatedGallery });
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = async (imageUrlToDelete: string) => {
        if (!vendorId) return;
        const updatedGallery = gallery.filter(url => url !== imageUrlToDelete);
        setGallery(updatedGallery);
        try {
            const vendorDocRef = doc(db, 'vendors', vendorId);
            await updateDoc(vendorDocRef, { gallery: updatedGallery });
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <GalleryBanner />
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Mi Portafolio</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((url, index) => (
                    <div key={index} className="relative group aspect-w-1 aspect-h-1">
                        <img src={url} alt={`Galería ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => handleDeleteImage(url)} className="text-white p-2 bg-red-600 rounded-full hover:bg-red-700">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="relative w-full h-full bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 aspect-w-1 aspect-h-1">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
                    {isUploading ? (
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Subiendo...</p>
                            <div className="w-24 bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <CameraIcon className="h-8 w-8 mx-auto" />
                            <p className="mt-1 text-sm">Añadir Imagen</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorGallery;