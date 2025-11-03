// FIX: Populating types.ts with all the necessary type definitions for the application.

export type Page =
    | 'home'
    | 'vendors'
    | 'inspiration'
    | 'inspiration-detail'
    | 'tools'
    | 'community'
    | 'vendor-profile'
    | 'registration'
    | 'client-registration'
    | 'vendorDashboard'
    | 'admin' // Nuevo tipo para el panel de admin
    // Vendor sub-pages from Header
    | 'bride-dresses'
    | 'bride-accessories'
    | 'bride-shoes'
    | 'beauty-makeup'
    | 'lingerie'
    | 'groom-inspiration'
    | 'groom-suits'
    // Vendor categories as pages - generated from VENDOR_CATEGORIES
    | 'salones-de-eventos'
    | 'fotógrafos'
    | 'banquetes'
    | 'música-y-dj'
    | 'vestidos-de-novia'
    | 'decoración'
    | 'floristerías'
    | 'pastelerías-de-boda'
    | 'trajes-de-novio'
    | 'joyerías'
    | 'autos-de-matrimonio'
    | 'partes-de-matrimonio'
    | 'wedding-planners'
    | 'cotillon-y-recuerdos'
    | 'luna-de-miel'
    | 'coros-y-musica-para-ceremonia'
    | 'animación-de-eventos'
    | 'clases-de-baile'
    | 'carpas-y-toldos'
    | 'food-trucks-y-carritos'
    | 'accesorios-de-novia'
    | 'zapatos-de-novia'
    | 'lencería'
    | (string & {});


export type VendorPage = 'dashboard' | 'profile' | 'gallery' | 'messages' | 'quote-requests' | 'services' | 'billing' | 'campus' | 'settings' | 'service-publication';

export interface Service {
    id: string;
    vendorId: string; // Enlace al proveedor
    name: string;
    description: string;
    price: number; // Podría ser más flexible en el futuro (rango, por paquete)
    category: string[]; // Cambiado de string a string[]
    features?: string[]; // Características o lo que incluye el servicio
    images?: string[]; // URLs de las imágenes del servicio
    locations?: string[]; // Ubicaciones donde se ofrece el servicio
    status: 'active' | 'inactive' | 'pending_review'; // Estado del servicio
    createdAt: string;
    updatedAt: string;
    averageRating?: number; // Calificación promedio del servicio
    reviewCount?: number; // Número de reseñas del servicio
}

// La interfaz Vendor se fusiona con AdminVendor para tener una definición completa
export type VendorStatus = 'Aprobado' | 'Pendiente' | 'Rechazado';

export interface Vendor { // Renombrado de AdminVendor a Vendor
    id?: string;
    name: string; // Nombre de la empresa/proveedor
    category: string; // Categoría principal del proveedor
    location: string; // Región principal del proveedor
    city?: string; // Añadir la propiedad city
    email?: string; // Email de la empresa
    phone?: string;
    registeredDate?: string;
    status?: VendorStatus;
    isPremium?: boolean;
    logoUrl?: string;
    description?: string;
    imageUrl?: string; // Añadido para consistencia
    startingPrice?: number; // Añadido para consistencia
    rating?: number; // Añadido para consistencia
    // Datos públicos de la empresa (redes sociales)
    facebookUrl?: string;
    instagramUrl?: string;
    websiteUrl?: string;
    // Datos de contacto personal (solo para administración o uso interno del proveedor)
    contactPersonName?: string;
    contactPersonLastName?: string;
    contactPersonRut?: string;
    contactPersonPhone?: string;
    contactPersonEmail?: string;
    averageRating?: number; // Calificación promedio del proveedor
    reviewCount?: number; // Número de reseñas del proveedor
}

export interface Inspiration {
    id: string;
    title: string;
    category: string;
    description: string;
    imageSearchTerms: string;
}

export interface RealWedding {
    id: string;
    name: string;
    location: string;
    photos: string[];
}

export interface ChecklistItem {
    id: number;
    task: string;
    category: string;
    completed: boolean;
}

export interface BudgetItem {
    id: number;
    item: string;
    category: string;
    estimated: number;
    actual: number;
}

export type GuestStatus = 'Confirmado' | 'Pendiente' | 'Rechazado';

export interface Guest {
    id: number;
    name: string;
    group: string;
    status: GuestStatus;
    table: number | null;
}

export interface WeddingInfo {
    userName: string;
    userRole: string;
    partnerName: string;
    partnerRole: string;
    commune: string;
    budget: number;
    guests: number;
    services: string[];
}

export interface CommunityPost {
    id: number;
    author: string;
    authorAvatar: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: number;
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'vendor';
}

export interface FAQItem {
    question: string;
    answer: string;
}

// Nueva interfaz para solicitudes de cotización
export type QuoteRequestStatus = 'pending' | 'responded' | 'accepted' | 'rejected';

export interface QuoteRequest {
    id: string;
    clientId: string;
    vendorId: string;
    serviceId: string; // El servicio específico por el que se pide cotización
    message: string;
    eventDate?: string; // Fecha del evento, si aplica
    status: QuoteRequestStatus;
    createdAt: string;
    updatedAt: string;
}

// Nueva interfaz para reseñas
export interface Review {
    id: string;
    clientId: string;
    vendorId: string;
    serviceId?: string; // Opcional, si la reseña es para un servicio específico
    rating: number; // 1-5 estrellas
    comment: string;
    createdAt: string;
}

export interface HeroSlide {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
}

// Tipos para Autenticación
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: 'admin' | 'user' | 'vendor';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
}