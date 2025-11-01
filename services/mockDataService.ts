import { MOCK_VENDORS, MOCK_ARTICLES, MOCK_CHECKLIST, MOCK_BUDGET_TEMPLATE, MOCK_FAQS } from '../constants';
import type { Vendor, Inspiration, ChecklistItem, BudgetItem, FAQItem } from '../types';

// Simula la latencia de la red
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getVendors = async (): Promise<Vendor[]> => {
    await delay(500); // Simulate network latency
    return MOCK_VENDORS;
};

export const getSimilarVendors = async (currentVendor: Vendor): Promise<Vendor[]> => {
    await delay(600);
    return MOCK_VENDORS.filter(
        v => v.category === currentVendor.category && v.name !== currentVendor.name
    ).slice(0, 3); // Devuelve hasta 3 proveedores similares
};


export const getInspiration = async (): Promise<Inspiration[]> => {
    await delay(800);
    // En el futuro, podríamos añadir más items de inspiración aquí
    return [...MOCK_ARTICLES];
};

export const getVendorFAQs = async (vendorName: string, vendorCategory: string): Promise<FAQItem[]> => {
    await delay(500);
    // Devuelve un conjunto genérico de FAQs, personalizadas con el nombre y la categoría del proveedor
    return MOCK_FAQS.map(faq => ({
        question: faq.question.replace('{category}', vendorCategory),
        answer: faq.answer.replace('{name}', vendorName)
    }));
};

export const getChecklist = async (): Promise<ChecklistItem[]> => {
    await delay(700);
    // Devuelve una copia para evitar mutaciones accidentales del objeto original
    return [...MOCK_CHECKLIST];
};

export const getBudgetTemplate = async (): Promise<BudgetItem[]> => {
    await delay(700);
    // Devuelve una copia
    return [...MOCK_BUDGET_TEMPLATE];
};