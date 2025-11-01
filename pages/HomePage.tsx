import React, { useRef, useState, useEffect } from 'react';
import type { Page, Vendor, RealWedding, Inspiration, HeroSlide } from '../types';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CameraIcon } from '../components/icons/CameraIcon';
import { RingIcon } from '../components/icons/RingIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import SeoMeta from '../components/SeoMeta';
import { MOCK_FEATURED_VENDORS, MOCK_REAL_WEDDINGS, MOCK_ARTICLES } from '../constants';
import VendorCard from '../components/VendorCard';
import RealWeddingCard from '../components/RealWeddingCard';
import InspirationCard from '../components/InspirationCard';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import Spinner from '../components/Spinner';

interface HomePageProps {
    navigate: (page: Page, data?: Vendor | Inspiration) => void;
}

const Section: React.FC<{ title: string, subtitle?: string, children: React.ReactNode, viewMoreLink?: () => void, viewMoreText?: string }> = ({ title, subtitle, children, viewMoreLink, viewMoreText }) => (
    <section className="py-16">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-brand-dark">{title}</h2>
                    {subtitle && <p className="text-brand-dark opacity-80 mt-2">{subtitle}</p>}
                </div>
                 {viewMoreLink && (
                    <button onClick={viewMoreLink} className="hidden md:flex items-center font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                        {viewMoreText || 'Ver más'}
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                )}
            </div>
            {children}
        </div>
    </section>
);

const Carousel: React.FC<{ children: React.ReactNode, itemWidthClass: string }> = ({ children, itemWidthClass }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -320 : 320; // Approx width of a card + gap
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative">
            <div ref={scrollRef} className="flex overflow-x-auto space-x-6 pb-4 -mx-6 px-6 scrollbar-hide">
                 {React.Children.map(children, (child) => (
                    <div className={`shrink-0 ${itemWidthClass}`}>
                        {child}
                    </div>
                ))}
            </div>
            <button
                onClick={() => scroll('left')}
                className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10 hidden md:block"
                aria-label="Scroll Left"
            >
                <ArrowLeftIcon className="h-6 w-6 text-brand-dark" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10 hidden md:block"
                aria-label="Scroll Right"
            >
                <ArrowRightIcon className="h-6 w-6 text-brand-dark" />
            </button>
        </div>
    );
};


const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    const [slides, setSlides] = useState<Omit<HeroSlide, 'id'>[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoadingHero, setIsLoadingHero] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            setIsLoadingHero(true);
            try {
                const docRef = doc(db, 'site_config', 'hero_slider');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().slides) {
                    setSlides(docSnap.data().slides);
                } else {
                    // Fallback to a default slide
                    setSlides([{
                        imageUrl: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?q=80&w=1600&h=900&auto=format&fit=crop',
                        title: 'La Boda de tus Sueños Comienza Aquí',
                        subtitle: 'Tu guía completa para planificar el día más feliz de tu vida, paso a paso.'
                    }]);
                }
            } catch (error) {
                console.error("Error fetching hero slides:", error);
                 setSlides([{
                    imageUrl: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?q=80&w=1600&h=900&auto=format&fit=crop',
                    title: 'La Boda de tus Sueños Comienza Aquí',
                    subtitle: 'Tu guía completa para planificar el día más feliz de tu vida, paso a paso.'
                }]);
            } finally {
                setIsLoadingHero(false);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setTimeout(() => {
                const nextSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
                setCurrentSlide(nextSlide);
            }, 5000); // Change slide every 5 seconds
            return () => clearTimeout(timer);
        }
    }, [currentSlide, slides]);

    const next = () => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    const prev = () => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);


    const features = [
        {
            icon: <RingIcon className="h-12 w-12 text-brand-primary" />,
            title: 'Proveedores de Confianza',
            description: 'Encuentra y contacta a los mejores profesionales para tu boda, desde fotógrafos hasta banqueteros.',
            buttonText: 'Buscar Proveedores',
            page: 'vendors' as Page,
        },
        {
            icon: <CameraIcon className="h-12 w-12 text-brand-primary" />,
            title: 'Inspiración sin Límites',
            description: 'Explora miles de fotos e ideas para cada detalle de tu boda. ¡Guarda tus favoritas!',
            buttonText: 'Ver Inspiración',
            page: 'inspiration' as Page,
        },
        {
            icon: <CalendarIcon className="h-12 w-12 text-brand-primary" />,
            title: 'Herramientas de Planificación',
            description: 'Organiza tus tareas, presupuesto y lista de invitados de manera fácil e intuitiva.',
            buttonText: 'Usar Herramientas',
            page: 'tools' as Page,
        },
    ];

    return (
        <div>
            <SeoMeta 
                title="Mi Boda Ideal - Tu Planificador de Bodas Completo"
                description="Planifica la boda de tus sueños con Mi Boda Ideal. Encuentra proveedores, inspiración, herramientas de presupuesto, checklist y más. Todo en un solo lugar."
            />
            {/* Hero Section */}
            <section className="relative h-[60vh] text-white overflow-hidden">
                {isLoadingHero ? (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center"><Spinner /></div>
                ) : (
                    <>
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform ease-out duration-1000"
                            style={{ backgroundImage: `url('${slides[currentSlide]?.imageUrl}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                             <div className="animate-fade-in-down">
                                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">{slides[currentSlide]?.title}</h1>
                                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{slides[currentSlide]?.subtitle}</p>
                            </div>
                            <button 
                                onClick={() => navigate('vendors')}
                                className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 animate-fade-in"
                            >
                                Empezar a Planificar
                            </button>
                        </div>
                        {slides.length > 1 && (
                             <>
                                <button onClick={prev} className="absolute top-1/2 left-4 z-20 p-2 bg-white/50 hover:bg-white/80 rounded-full text-brand-dark">
                                    <ChevronLeftIcon className="h-6 w-6"/>
                                </button>
                                <button onClick={next} className="absolute top-1/2 right-4 z-20 p-2 bg-white/50 hover:bg-white/80 rounded-full text-brand-dark">
                                    <ChevronRightIcon className="h-6 w-6"/>
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                                    {slides.map((_, i) => (
                                        <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${currentSlide === i ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}></button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-serif text-center font-bold text-brand-dark mb-12">Todo lo que necesitas para tu Boda Ideal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3">{feature.title}</h3>
                                <p className="text-brand-dark opacity-80 mb-6 flex-grow">{feature.description}</p>
                                <button
                                    onClick={() => navigate(feature.page)}
                                    className="mt-auto bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
                                >
                                    {feature.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vendors Section */}
            <Section title="Proveedores Destacados" viewMoreLink={() => navigate('vendors')}>
                <Carousel itemWidthClass="w-80">
                    {MOCK_FEATURED_VENDORS.map((vendor) => (
                        <VendorCard 
                            key={vendor.name} 
                            vendor={vendor} 
                            onVendorSelect={(v) => navigate('vendor-profile', v)}
                            isFavorite={false} // Assuming we don't know favorites on homepage
                            onToggleFavorite={() => {}} // Placeholder
                        />
                    ))}
                </Carousel>
            </Section>

             {/* Real Weddings Section */}
            <Section title="Matrimonios Reales" subtitle="Inspírate con las historias de otras parejas." viewMoreText="Ver más matrimonios">
                 <Carousel itemWidthClass="w-80">
                    {MOCK_REAL_WEDDINGS.map((wedding) => (
                        <RealWeddingCard key={wedding.id} wedding={wedding} />
                    ))}
                </Carousel>
            </Section>

            {/* Ideas & Tips Section */}
            <Section title="Ideas y Consejos" subtitle="Encuentra la inspiración que necesitas en nuestros artículos." viewMoreLink={() => navigate('inspiration')} viewMoreText="Ver más ideas">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {MOCK_ARTICLES.map((item) => (
                        <InspirationCard 
                            key={item.id} 
                            item={item} 
                            onSelect={(i) => navigate('inspiration-detail', i)} 
                        />
                    ))}
                </div>
            </Section>

        </div>
    );
};

export default HomePage;