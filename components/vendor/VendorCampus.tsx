import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { PlayCircleIcon } from '../icons/PlayCircleIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import Spinner from '../Spinner';

interface Resource {
    id: string;
    type: string;
    title: string;
    category: string;
    icon: string; // Icon identifier
}

interface FeaturedContent {
    type: string;
    title: string;
    description: string;
    imageUrl: string;
}

const iconMap: { [key: string]: React.ReactElement } = {
    BookOpenIcon: <BookOpenIcon className="h-8 w-8 text-brand-primary" />,
    PlayCircleIcon: <PlayCircleIcon className="h-8 w-8 text-brand-primary" />,
};

const VendorCampus: React.FC = () => {
    const [featuredContent, setFeaturedContent] = useState<FeaturedContent | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch featured content (assuming one document with a specific ID)
                const featuredDocRef = doc(db, 'campusFeatured', 'main');
                const featuredDocSnap = await getDoc(featuredDocRef);
                if (featuredDocSnap.exists()) {
                    setFeaturedContent(featuredDocSnap.data() as FeaturedContent);
                }

                // Fetch resources
                const resourcesCollectionRef = collection(db, 'campusResources');
                const resourcesSnapshot = await getDocs(resourcesCollectionRef);
                const resourcesList = resourcesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
                setResources(resourcesList);

            } catch (error) {
                console.error("Error fetching campus data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">Campus Premium</h3>
            <p className="text-gray-600 mb-8">Recursos exclusivos para hacer crecer tu negocio de bodas.</p>

            {/* Featured Content */}
            {featuredContent && (
                <section className="mb-10">
                    <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Contenido Destacado</h4>
                    <div className="bg-brand-light rounded-lg overflow-hidden md:flex">
                        <div className="md:w-1/2">
                            <img src={featuredContent.imageUrl} alt={featuredContent.title} className="h-full w-full object-cover"/>
                        </div>
                        <div className="p-6 md:w-1/2 flex flex-col justify-center">
                            <p className="text-sm font-bold text-brand-primary uppercase">{featuredContent.type}</p>
                            <h2 className="text-2xl font-bold text-brand-dark mt-2 mb-3">{featuredContent.title}</h2>
                            <p className="text-gray-600 mb-4">{featuredContent.description}</p>
                            <button className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg self-start hover:bg-brand-accent transition-colors">
                                Ver Webinar Ahora
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Additional Resources */}
            <section>
                <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Recursos Adicionales</h4>
                {resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map(resource => (
                            <div key={resource.id} className="bg-gray-50 rounded-lg p-5 flex items-start space-x-4 border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0">
                                    {iconMap[resource.icon] || <BookOpenIcon className="h-8 w-8 text-brand-primary" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">{resource.category}</p>
                                    <h5 className="font-bold text-brand-dark text-lg mb-1">{resource.title}</h5>
                                    <a href="#" className="text-sm font-semibold text-brand-primary hover:underline">{resource.type === 'Artículo' ? 'Leer Artículo' : 'Ver Contenido'} &rarr;</a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay recursos adicionales disponibles en este momento.</p>
                )}
            </section>
        </div>
    );
};

export default VendorCampus;