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


export interface Vendor {
    id?: string;
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

// Tipos para el Panel de Administrador
export type VendorStatus = 'Aprobado' | 'Pendiente' | 'Rechazado';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    registeredDate: string; // Consider using Firestore Timestamp in real app
    weddingDate?: string;
    location: string;
    phone?: string;
}

export interface AdminVendor {
    id: string;
    name: string;
    category: string;
    location: string;
    email: string;
    phone?: string;
    registeredDate: string; // Consider using Firestore Timestamp in real app
    status: VendorStatus;
    isPremium?: boolean;
    // FIX: Add gallery property to match usage in VendorProfile.tsx
    gallery?: string[];
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