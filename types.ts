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
    | 'vendorDashboard'
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
    | 'fotografos'
    | 'banquetes'
    | 'musica-y-dj'
    | 'vestidos-de-novia'
    | 'decoracion'
    | 'floristerias'
    | 'pastelerias-de-boda'
    | 'trajes-de-novio'
    | 'joyerias'
    | 'autos-de-matrimonio'
    | 'partes-de-matrimonio'
    | 'wedding-planners'
    | 'cotillon-y-recuerdos'
    | 'luna-de-miel'
    | 'coros-y-musica-para-ceremonia'
    | 'animacion-de-eventos'
    | 'clases-de-baile'
    | 'carpas-y-toldos'
    | 'food-trucks-y-carritos'
    | 'accesorios-de-novia'
    | 'zapatos-de-novia'
    | 'lenceria'
    | (string & {});


export interface Vendor {
    name: string;
    category: string;
    location: string;
    city: string;
    rating: number;
    description: string;
    imageUrl: string;
    startingPrice: number;
    isPremium?: boolean;
}

export interface Inspiration {
    id: string;
    title: string;
    category: string;
    description: string;
    imageSearchTerms: string;
}

export interface RealWedding {
    id: number;
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
