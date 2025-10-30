import React from 'react';
import type { Vendor, RealWedding, Inspiration } from './types';
import { CameraIcon } from './components/icons/CameraIcon';
import { MusicIcon } from './components/icons/MusicIcon';
import { BuildingIcon } from './components/icons/BuildingIcon';
import { CutleryIcon } from './components/icons/CutleryIcon';
import { DressIcon } from './components/icons/DressIcon';
import { DecorIcon } from './components/icons/DecorIcon';

export const VENDOR_CATEGORIES = [
    "Salones de eventos",
    "Fotógrafos",
    "Banquetes",
    "Música y DJ",
    "Vestidos de novia",
    "Decoración",
    "Floristerías",
    "Pastelerías de boda",
    "Trajes de novio",
    "Joyerías",
    "Autos de matrimonio",
    "Partes de matrimonio",
    "Wedding Planners",
    "Belleza y Maquillaje",
    "Cotillón y Recuerdos",
    "Luna de miel",
    "Coros y Música para Ceremonia",
    "Animación de eventos",
    "Clases de baile",
    "Carpas y Toldos",
    "Food trucks y carritos",
    "Accesorios de novia",
    "Zapatos de novia",
    "Lencería"
];

export const CHILE_REGIONS = [
    "Arica y Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana de Santiago",
    "O'Higgins",
    "Maule",
    "Ñuble",
    "Biobío",
    "La Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén",
    "Magallanes"
];

export const MOCK_REVIEWS = [
    { author: 'Ana & Juan', rating: 5, comment: '¡Increíble servicio! Hicieron que nuestro día fuera mágico. Súper recomendados, muy profesionales y atentos a cada detalle.' },
    { author: 'Sofía R.', rating: 4, comment: 'Quedamos muy contentos con el resultado final. La comunicación podría haber sido un poco más fluida al principio, pero el trabajo fue impecable.' },
    { author: 'Carlos Morales', rating: 5, comment: 'Superaron todas nuestras expectativas. El equipo es fantástico y el trato fue muy cercano. ¡Gracias por todo!' },
];

export const MOCK_VENDORS: Vendor[] = [
    // Fotógrafos - Metropolitana de Santiago
    { name: 'Momentos Inolvidables Fotografía', category: 'Fotógrafos', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.9, description: 'Capturamos la esencia de tu amor con un estilo natural y emotivo.', imageUrl: 'https://images.unsplash.com/photo-1542042161-d10f8a84d872?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 550000 },
    { name: 'Estudio Creativo Bodas', category: 'Fotógrafos', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.8, description: 'Fotografía y video de bodas con un toque cinematográfico y moderno.', imageUrl: 'https://images.unsplash.com/photo-1515942259902-861c89a35e8a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 700000, isPremium: true },
    { name: 'Luz & Sombra Photos', category: 'Fotógrafos', location: 'Ñuñoa, Metropolitana de Santiago', city: 'Ñuñoa', rating: 4.9, description: 'Especialistas en bodas íntimas y elopements. Contamos tu historia de forma única.', imageUrl: 'https://images.unsplash.com/photo-1511285560921-4c9292848e27?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 480000 },
    // Fotógrafos - Valparaíso
    { name: 'Fotos del Puerto', category: 'Fotógrafos', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.7, description: 'Capturando la magia de tu boda con el Océano Pacífico de fondo.', imageUrl: 'https://images.unsplash.com/photo-1572995223979-29313a4cf453?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 520000 },
    { name: 'Recuerdos de Viña', category: 'Fotógrafos', location: 'Valparaíso, Valparaíso', city: 'Valparaíso', rating: 4.8, description: 'Arte y fotografía se unen para inmortalizar tu día especial.', imageUrl: 'https://images.unsplash.com/photo-1513280003126-d50c3da74342?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 490000 },
    // Salones de eventos - Metropolitana de Santiago
    { name: 'Casona de Eventos La Reina', category: 'Salones de eventos', location: 'La Reina, Metropolitana de Santiago', city: 'La Reina', rating: 4.9, description: 'Un lugar mágico con amplios jardines para una boda de ensueño.', imageUrl: 'https://images.unsplash.com/photo-1522036496963-3f86e06a64b9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2500000, isPremium: true },
    { name: 'Centro de Eventos Los Almendros', category: 'Salones de eventos', location: 'Chicureo, Metropolitana de Santiago', city: 'Colina', rating: 4.8, description: 'Modernidad y elegancia se combinan en nuestro exclusivo centro de eventos.', imageUrl: 'https://images.unsplash.com/photo-1594019557038-12a5245a4988?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3200000 },
    // Salones de eventos - Biobío
    { name: 'Hacienda Patagonia', category: 'Salones de eventos', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.9, description: 'Estilo rústico y elegante con vistas espectaculares al río Biobío.', imageUrl: 'https://images.unsplash.com/photo-1620322231579-d576359042b3?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1800000 },
    // Banquetes - Metropolitana de Santiago
    { name: 'Gastronomía de Reyes', category: 'Banquetes', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 5.0, description: 'Alta cocina para un día inolvidable. Menús personalizados y servicio de excelencia.', imageUrl: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 80000, isPremium: true },
    { name: 'El Festín Banquetes', category: 'Banquetes', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.7, description: 'Sabores que cuentan historias. Nos adaptamos a tu estilo y presupuesto.', imageUrl: 'https://images.unsplash.com/photo-1505253716362-af78f5d115de?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 65000 },
    // Música y DJ - Metropolitana de Santiago
    { name: 'Fiesta Total DJ', category: 'Música y DJ', location: 'Santiago Centro, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'La mejor música y animación para que tu fiesta de bodas sea inolvidable.', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 350000 },
    // Pastelerías de boda - Valparaíso
    { name: 'Dulce Encanto Viña', category: 'Pastelerías de boda', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.9, description: 'Tortas de novios de diseño, personalizadas para reflejar tu historia de amor.', imageUrl: 'https://images.unsplash.com/photo-1586956241220-14197da72983?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 90000 },
];

export const MOCK_FEATURED_VENDORS: Vendor[] = MOCK_VENDORS.filter(v => v.isPremium).slice(0, 8);


export const MOCK_REAL_WEDDINGS: RealWedding[] = [
    {
        id: 1,
        name: 'Daniela & Rodrigo',
        location: 'Chillán, Ñuble',
        photos: [
            'https://images.unsplash.com/photo-1597871442261-26884143431d?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1543306973-108873933e16?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1571424192451-f763025ec72e?q=80&w=200&auto=format&fit=crop',
        ]
    },
    {
        id: 2,
        name: 'Caro & Magda',
        location: 'Paine, Maipo',
        photos: [
            'https://images.unsplash.com/photo-1509623903142-5c62bda3f393?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560953689-dd06de818965?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533246200215-9ea4459468e2?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558961166-26a9f4549f91?q=80&w=200&auto=format&fit=crop',
        ]
    },
    {
        id: 3,
        name: 'Fabiola & Alberto',
        location: 'San José de Maipo, Cordillera',
        photos: [
            'https://images.unsplash.com/photo-1525997429365-d62194de8256?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519225383533-5c31c0ae1c4e?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505942634591-933a2027ba19?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522008338728-4e50d87def37?q=80&w=200&auto=format&fit=crop',
        ]
    },
     {
        id: 4,
        name: 'Camila & Sergio',
        location: 'Paine, Maipo',
        photos: [
            'https://images.unsplash.com/photo-1567303314286-93c64a5113d1?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595407753234-088204533243?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1527578402222-c6e60b16b29b?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1587329323110-A873c14482a5?q=80&w=200&auto=format&fit=crop',
        ]
    },
];

export const MOCK_ARTICLES: Inspiration[] = [
    {
        id: 'article-1',
        title: 'Cómo calcular el presupuesto de un matrimonio en Chile',
        category: 'Planificación del Matrimonio',
        description: 'Descubre los pasos clave para definir un presupuesto realista para tu boda, considerando todos los gastos importantes.',
        imageSearchTerms: 'wedding budget planning, calculator, spreadsheet',
    },
    {
        id: 'article-2',
        title: '50 vestidos de novia con pantalones: ¡marca la diferencia!',
        category: 'La Novia',
        description: 'Atrévete a romper esquemas con estas increíbles opciones de trajes y jumpsuits para novias modernas y con estilo.',
        imageSearchTerms: 'bridal jumpsuit, wedding pantsuit, modern bride',
    },
    {
        id: 'article-3',
        title: '15 ideas de recuerdos para matrimonio civil',
        category: 'Los Detalles del Matrimonio',
        description: 'Sorprende a tus invitados con recuerdos únicos y significativos para tu boda civil. ¡Ideas originales y económicas!',
        imageSearchTerms: 'wedding favors, civil ceremony gift, guest souvenir',
    },
     {
        id: 'article-4',
        title: '¿Con qué signos del zodiaco eres más compatible en el amor?',
        category: 'Actualidad y Tendencias',
        description: 'La astrología puede darte pistas sobre tu compatibilidad amorosa. ¡Descubre qué dicen los astros sobre tu pareja ideal!',
        imageSearchTerms: 'zodiac signs love compatibility, astrology couple',
    }
];

// FIX: Corrected type to React.ReactElement and used React.createElement to avoid JSX syntax in a .ts file.
export const CATEGORY_DETAILS: { [key: string]: { icon: React.ReactElement, description: string } } = {
    'Fotógrafos': {
        icon: React.createElement(CameraIcon),
        description: 'Busca a los mejores fotógrafos y contrata al profesional para tu gran día.'
    },
    'Fotografía': {
        icon: React.createElement(CameraIcon),
        description: 'Busca a los mejores fotógrafos y contrata al profesional para tu gran día.'
    },
    'Música y DJ': {
        icon: React.createElement(MusicIcon),
        description: 'Contacta con los profesionales de música y prepárate para darlo todo en la pista.'
    },
    'Música': {
        icon: React.createElement(MusicIcon),
        description: 'Contacta con los profesionales de música y prepárate para darlo todo en la pista.'
    },
    'Salones de eventos': {
        icon: React.createElement(BuildingIcon),
        description: 'Encuentra el lugar perfecto que se adapte al estilo y tamaño de tu celebración.'
    },
    'Celebración': {
        icon: React.createElement(BuildingIcon),
        description: 'Encuentra el lugar perfecto que se adapte al estilo y tamaño de tu celebración.'
    },
    'Banquetes': {
        icon: React.createElement(CutleryIcon),
        description: 'Deleita a tus invitados con menús exquisitos y un servicio de catering impecable.'
    },
    'Vestidos de novia': {
        icon: React.createElement(DressIcon),
        description: 'Descubre el vestido de tus sueños en las mejores boutiques y ateliers.'
    },
    'Decoración': {
        icon: React.createElement(DecorIcon),
        description: 'Crea el ambiente mágico que siempre imaginaste con expertos en decoración.'
    },
};