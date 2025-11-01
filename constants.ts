import React from 'react';
import type { Vendor, RealWedding, Inspiration, ChecklistItem, BudgetItem, FAQItem } from './types';
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
    // --- Fotógrafos ---
    { name: 'Momentos Inolvidables Fotografía', category: 'Fotógrafos', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.9, description: 'Capturamos la esencia de tu amor con un estilo natural y emotivo.', imageUrl: 'https://images.unsplash.com/photo-1542042161-d10f8a84d872?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 550000 },
    { name: 'Estudio Creativo Bodas', category: 'Fotógrafos', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.8, description: 'Fotografía y video de bodas con un toque cinematográfico y moderno.', imageUrl: 'https://images.unsplash.com/photo-1515942259902-861c89a35e8a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 700000, isPremium: true },
    { name: 'Luz & Sombra Photos', category: 'Fotógrafos', location: 'Ñuñoa, Metropolitana de Santiago', city: 'Ñuñoa', rating: 4.9, description: 'Especialistas en bodas íntimas y elopements. Contamos tu historia de forma única.', imageUrl: 'https://images.unsplash.com/photo-1511285560921-4c9292848e27?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 480000 },
    { name: 'Retratos del Alma', category: 'Fotógrafos', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.8, description: 'Fotografía documental para bodas. Capturamos momentos reales y sin poses.', imageUrl: 'https://images.unsplash.com/photo-1519225383533-5c31c0ae1c4e?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 620000 },
    { name: 'Click Santiago', category: 'Fotógrafos', location: 'La Florida, Metropolitana de Santiago', city: 'La Florida', rating: 4.7, description: 'Fotografía vibrante y llena de vida para parejas que quieren divertirse.', imageUrl: 'https://images.unsplash.com/photo-1587329323110-A873c14482a5?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 490000 },
    { name: 'Fotos del Puerto', category: 'Fotógrafos', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.7, description: 'Capturando la magia de tu boda con el Océano Pacífico de fondo.', imageUrl: 'https://images.unsplash.com/photo-1572995223979-29313a4cf453?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 520000 },
    { name: 'Recuerdos de Viña', category: 'Fotógrafos', location: 'Valparaíso, Valparaíso', city: 'Valparaíso', rating: 4.8, description: 'Arte y fotografía se unen para inmortalizar tu día especial.', imageUrl: 'https://images.unsplash.com/photo-1513280003126-d50c3da74342?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 490000 },
    { name: 'Costa Photo Bodas', category: 'Fotógrafos', location: 'Concón, Valparaíso', city: 'Concón', rating: 4.9, description: 'Especialistas en sesiones de pareja en la playa y bodas con vista al mar.', imageUrl: 'https://images.unsplash.com/photo-1509623903142-5c62bda3f393?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 580000, isPremium: true },
    { name: 'Fotografía del Sur', category: 'Fotógrafos', location: 'Chillán, Ñuble', city: 'Chillán', rating: 4.8, description: 'Especialistas en bodas campestres y al aire libre en la hermosa región de Ñuble.', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 450000 },
    { name: 'Click Emotivo', category: 'Fotógrafos', location: 'Chillán, Ñuble', city: 'Chillán', rating: 4.9, description: 'Cada click es una emoción. Capturamos la alegría y el amor de tu gran día.', imageUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 500000 },
    { name: 'Arte Visual Ñuble', category: 'Fotógrafos', location: 'San Carlos, Ñuble', city: 'San Carlos', rating: 4.7, description: 'Fotografía de bodas con un enfoque artístico y documental. Cubrimos toda la región.', imageUrl: 'https://images.unsplash.com/photo-1550004992-081734b4f1b8?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 420000 },
    { name: 'Enfoque Nupcial Chillán', category: 'Fotógrafos', location: 'Chillán, Ñuble', city: 'Chillán', rating: 4.9, description: 'Servicios premium de fotografía y video para bodas. Calidad y profesionalismo garantizados.', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 650000, isPremium: true },
    { name: 'Recuerdos del Valle', category: 'Fotógrafos', location: 'Bulnes, Ñuble', city: 'Bulnes', rating: 4.8, description: 'Capturamos la belleza natural de tu boda en los valles de Ñuble. Estilo rústico y cálido.', imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb39825785?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 470000 },
    { name: 'Objectivo Ñuble', category: 'Fotógrafos', location: 'Chillán, Ñuble', city: 'Chillán', rating: 4.8, description: 'Fotografía profesional con un toque moderno. Nos especializamos en capturar la alegría y los detalles espontáneos de tu boda en Ñuble.', imageUrl: 'https://images.unsplash.com/photo-1513031408073-380953a353fa?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 480000 },
    { name: 'Foto Campestre', category: 'Fotógrafos', location: 'San Fabián de Alico, Ñuble', city: 'San Fabián', rating: 4.9, description: 'Ideal para matrimonios en entornos naturales. Capturamos la belleza de la precordillera de Ñuble en cada una de tus fotos.', imageUrl: 'https://images.unsplash.com/photo-1527578402222-c6e60b16b29b?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 530000 },
    { name: 'Eterno Instante Fotografía', category: 'Fotógrafos', location: 'Quirihue, Ñuble', city: 'Quirihue', rating: 4.7, description: 'Congelamos el tiempo en el día más importante de tu vida. Cobertura completa en la provincia de Itata y toda la región.', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd51622?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 460000 },
    { name: 'Víctor Jara Fotógrafo', category: 'Fotógrafos', location: 'San Carlos, Ñuble', city: 'San Carlos', rating: 4.9, description: 'Con un estilo artístico y documental, narramos la historia de tu amor. Servicio premium en la cuna de Violeta Parra.', imageUrl: 'https://images.unsplash.com/photo-1542042161-d10f8a84d872?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 600000, isPremium: true },
    { name: 'Pixel & Amor', category: 'Fotógrafos', location: 'Chillán Viejo, Ñuble', city: 'Chillán Viejo', rating: 4.8, description: 'Fotografía y video aéreo con drones. Le damos una perspectiva única y espectacular a tu matrimonio.', imageUrl: 'https://images.unsplash.com/photo-1595407753234-088204533243?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 680000 },
    { name: 'Flash Bodas Coihueco', category: 'Fotógrafos', location: 'Coihueco, Ñuble', city: 'Coihueco', rating: 4.7, description: 'Servicios de fotografía accesibles y de alta calidad para que tengas el mejor recuerdo sin salirte de tu presupuesto.', imageUrl: 'https://images.unsplash.com/photo-1583925258623-264138435d8a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 390000 },
    { name: 'Revela Emociones', category: 'Fotógrafos', location: 'Chillán, Ñuble', city: 'Chillán', rating: 5.0, description: 'Nos enfocamos en las emociones, las risas y las lágrimas de alegría. Un recuerdo auténtico y lleno de vida de tu boda.', imageUrl: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 560000 },
    { name: 'Longaví Films & Photo', category: 'Fotógrafos', location: 'San Gregorio de Ñiquén, Ñuble', city: 'Ñiquén', rating: 4.8, description: 'Servicios integrales de fotografía y video para bodas. Calidad cinematográfica para un día de película.', imageUrl: 'https://images.unsplash.com/photo-1529634816432-2d4a1b896934?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 720000 },
    { name: 'Foco Sur Bodas', category: 'Fotógrafos', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.9, description: 'Fotografía moderna y elegante para matrimonios en Concepción y alrededores.', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd51622?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 530000 },
    { name: 'Biobío Nupcial', category: 'Fotógrafos', location: 'Talcahuano, Biobío', city: 'Talcahuano', rating: 4.7, description: 'Tu historia de amor contada con imágenes frescas y espontáneas.', imageUrl: 'https://images.unsplash.com/photo-1500305259837-16bd534d1637?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 460000 },
    { name: 'Patagonia Films', category: 'Fotógrafos', location: 'Puerto Varas, Los Lagos', city: 'Puerto Varas', rating: 5.0, description: 'Fotografía y video de destino en los paisajes más impresionantes del sur de Chile.', imageUrl: 'https://images.unsplash.com/photo-1561063212-d6a6951b8b60?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 850000, isPremium: true },
    { name: 'Elqui Wedding Photo', category: 'Fotógrafos', location: 'La Serena, Coquimbo', city: 'La Serena', rating: 4.8, description: 'Especialistas en bodas bajo el cielo estrellado del Valle del Elqui.', imageUrl: 'https://images.unsplash.com/photo-1601135312359-75a7a7837a0d?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 590000 },
    { name: 'Atacama Dreams', category: 'Fotógrafos', location: 'San Pedro de Atacama, Antofagasta', city: 'San Pedro de Atacama', rating: 4.9, description: 'Bodas únicas en el desierto más árido del mundo. Fotografía de aventura.', imageUrl: 'https://images.unsplash.com/photo-1588232493393-3d069b7f385a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 950000 },
    { name: 'Araucanía Mágica', category: 'Fotógrafos', location: 'Pucón, La Araucanía', city: 'Pucón', rating: 4.9, description: 'Fotografía con la imponente belleza del volcán Villarrica y los lagos del sur.', imageUrl: 'https://images.unsplash.com/photo-1504274292942-7a7249b6b907?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 720000 },
    { name: 'Norte Grande Fotos', category: 'Fotógrafos', location: 'Arica, Arica y Parinacota', city: 'Arica', rating: 4.7, description: 'Capturamos la luz del norte en tu boda. Colores vibrantes y recuerdos eternos.', imageUrl: 'https://images.unsplash.com/photo-1558961166-26a9f4549f91?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 480000 },
    { name: 'Iquique Bodas', category: 'Fotógrafos', location: 'Iquique, Tarapacá', city: 'Iquique', rating: 4.8, description: 'Fotografía profesional en las hermosas playas de Iquique. Atardeceres inolvidables.', imageUrl: 'https://images.unsplash.com/photo-1597871442261-26884143431d?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 510000 },
    { name: 'Maule Nupcial', category: 'Fotógrafos', location: 'Talca, Maule', city: 'Talca', rating: 4.8, description: 'Contamos historias de amor en la Región del Maule, desde los viñedos hasta la costa.', imageUrl: 'https://images.unsplash.com/photo-1505942634591-933a2027ba19?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 470000 },
    { name: 'Valdivia Love Story', category: 'Fotógrafos', location: 'Valdivia, Los Ríos', city: 'Valdivia', rating: 4.9, description: 'Fotografía con el encanto de los ríos y la selva valdiviana. Magia sureña.', imageUrl: 'https://images.unsplash.com/photo-1522008338728-4e50d87def37?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 600000 },
    { name: 'F Patagonia Photo', category: 'Fotógrafos', location: 'Punta Arenas, Magallanes', city: 'Punta Arenas', rating: 4.9, description: 'Bodas en el fin del mundo. Fotografía de autor para parejas aventureras.', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 900000, isPremium: true },
    { name: 'Chiloé Mágico', category: 'Fotógrafos', location: 'Castro, Los Lagos', city: 'Castro', rating: 5.0, description: 'Capturamos la mitología y belleza de Chiloé en tu reportaje de bodas.', imageUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 750000 },
    { name: 'Foto Rancagua', category: 'Fotógrafos', location: 'Rancagua, O\'Higgins', city: 'Rancagua', rating: 4.8, description: 'Fotografía profesional para bodas en la capital de O\'Higgins.', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd51622?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 480000 },
    { name: 'Aysen Wedding Film', category: 'Fotógrafos', location: 'Coyhaique, Aysén', city: 'Coyhaique', rating: 4.9, description: 'Documentamos tu boda en los paisajes indómitos de la Patagonia.', imageUrl: 'https://images.unsplash.com/photo-1561063212-d6a6951b8b60?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 880000 },
    { name: 'Copiapó Bodas', category: 'Fotógrafos', location: 'Copiapó, Atacama', city: 'Copiapó', rating: 4.7, description: 'Capturando el amor en el desierto florido. Fotografía única.', imageUrl: 'https://images.unsplash.com/photo-1588232493393-3d069b7f385a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 530000 },

    // --- Salones de eventos ---
    { name: 'Casona de Eventos La Reina', category: 'Salones de eventos', location: 'La Reina, Metropolitana de Santiago', city: 'La Reina', rating: 4.9, description: 'Un lugar mágico con amplios jardines para una boda de ensueño.', imageUrl: 'https://images.unsplash.com/photo-1522036496963-3f86e06a64b9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2500000, isPremium: true },
    { name: 'Centro de Eventos Los Almendros', category: 'Salones de eventos', location: 'Chicureo, Metropolitana de Santiago', city: 'Colina', rating: 4.8, description: 'Modernidad y elegancia se combinan en nuestro exclusivo centro de eventos.', imageUrl: 'https://images.unsplash.com/photo-1594019557038-12a5245a4988?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3200000 },
    { name: 'Hacienda Santa Martina', category: 'Salones de eventos', location: 'Lo Barnechea, Metropolitana de Santiago', city: 'Lo Barnechea', rating: 5.0, description: 'Vistas panorámicas a la cordillera y un servicio de lujo para tu matrimonio.', imageUrl: 'https://images.unsplash.com/photo-1587899763374-b8a9de193158?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 4500000, isPremium: true },
    { name: 'Parque Lo Arcaya', category: 'Salones de eventos', location: 'Pirque, Metropolitana de Santiago', city: 'Pirque', rating: 4.9, description: 'Un entorno campestre y sofisticado a minutos de Santiago.', imageUrl: 'https://images.unsplash.com/photo-1606049255628-a40387a216f9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2800000 },
    { name: 'Castillo del Mar', category: 'Salones de eventos', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.9, description: 'Celebra tu boda con una vista privilegiada al mar en un entorno histórico.', imageUrl: 'https://images.unsplash.com/photo-1560953689-dd06de818965?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3800000 },
    { name: 'Viña del Viento', category: 'Salones de eventos', location: 'Casablanca, Valparaíso', city: 'Casablanca', rating: 4.8, description: 'Matrimonios inolvidables entre viñedos, con la mejor gastronomía de la zona.', imageUrl: 'https://images.unsplash.com/photo-1563458407913-9a1352a488f9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3500000 },
    { name: 'Hacienda Patagonia', category: 'Salones de eventos', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.9, description: 'Estilo rústico y elegante con vistas espectaculares al río Biobío.', imageUrl: 'https://images.unsplash.com/photo-1620322231579-d576359042b3?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1800000 },
    { name: 'Elqui Domos', category: 'Salones de eventos', location: 'Valle del Elqui, Coquimbo', city: 'Paihuano', rating: 5.0, description: 'Una boda bajo las estrellas en el corazón del Valle del Elqui. Experiencia única.', imageUrl: 'https://images.unsplash.com/photo-1571474004503-8137397a615a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 4000000, isPremium: true },
    { name: 'Hotel de la Patagonia', category: 'Salones de eventos', location: 'Torres del Paine, Magallanes', city: 'Torres del Paine', rating: 5.0, description: 'El "sí, quiero" en el fin del mundo. Lujo y naturaleza en estado puro.', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 8000000 },
    { name: 'Casona del Maipo', category: 'Salones de eventos', location: 'San José de Maipo, Metropolitana de Santiago', city: 'San José de Maipo', rating: 4.7, description: 'Aire puro, vistas a la montaña y un ambiente acogedor para tu celebración.', imageUrl: 'https://images.unsplash.com/photo-1580252192257-a9a7a1334812?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2200000 },
    { name: 'Club de Golf La Dehesa', category: 'Salones de eventos', location: 'Lo Barnechea, Metropolitana de Santiago', city: 'Lo Barnechea', rating: 4.8, description: 'Elegancia clásica y servicio impecable en un entorno exclusivo y verde.', imageUrl: 'https://images.unsplash.com/photo-1511285560921-4c9292848e27?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3900000 },
    { name: 'Viña Santa Cruz', category: 'Salones de eventos', location: 'Lolol, O\'Higgins', city: 'Lolol', rating: 4.9, description: 'Celebra tu amor en el corazón del Valle de Colchagua, rodeado de tradición y buenos vinos.', imageUrl: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3300000, isPremium: true },
    { name: 'Termas de Chillán', category: 'Salones de eventos', location: 'Pinto, Ñuble', city: 'Pinto', rating: 4.7, description: 'Una boda de invierno o verano en un entorno de montaña único.', imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3000000 },
    { name: 'Club Hípico de Santiago', category: 'Salones de eventos', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.8, description: 'Un lugar histórico y monumental para una celebración de gran envergadura.', imageUrl: 'https://images.unsplash.com/photo-1594019557038-12a5245a4988?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 5000000 },
    { name: 'Marina Golf Rapel', category: 'Salones de eventos', location: 'Las Cabras, O\'Higgins', city: 'Las Cabras', rating: 4.7, description: 'Celebra tu matrimonio a orillas del Lago Rapel. Vistas y entorno privilegiado.', imageUrl: 'https://images.unsplash.com/photo-1522036496963-3f86e06a64b9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2600000 },
    { name: 'Hotel Antay Arica', category: 'Salones de eventos', location: 'Arica, Arica y Parinacota', city: 'Arica', rating: 4.6, description: 'Salones modernos y con la mejor tecnología para tu boda en la puerta norte de Chile.', imageUrl: 'https://images.unsplash.com/photo-1587899763374-b8a9de193158?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1900000 },
    { name: 'Hotel Chinchorro Suites', category: 'Salones de eventos', location: 'Arica, Arica y Parinacota', city: 'Arica', rating: 4.7, description: 'Celebra tu boda con la elegancia y comodidad de nuestros salones, con una vista privilegiada a la costa de Arica. Servicio de excelencia.', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2200000, isPremium: true },
    { name: 'Casona Doña Peta', category: 'Salones de eventos', location: 'Valle de Azapa, Arica y Parinacota', city: 'Arica', rating: 4.9, description: 'Un oasis en el Valle de Azapa. Nuestra casona colonial y hermosos jardines son el escenario perfecto para una boda campestre y romántica.', imageUrl: 'https://images.unsplash.com/photo-1606049255628-a40387a216f9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1800000 },
    { name: 'Centro de Eventos El Morro', category: 'Salones de eventos', location: 'Arica, Arica y Parinacota', city: 'Arica', rating: 4.8, description: 'Espacios versátiles y modernos a los pies del Morro de Arica. Equipamiento completo para que tu celebración sea un éxito total.', imageUrl: 'https://images.unsplash.com/photo-1594019557038-12a5245a4988?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2500000 },
    { name: 'Terraza La Lisera', category: 'Salones de eventos', location: 'Arica, Arica y Parinacota', city: 'Arica', rating: 4.6, description: 'Tu matrimonio con el sonido de las olas de fondo. Nuestra terraza ofrece un ambiente relajado y una gastronomía marina insuperable.', imageUrl: 'https://images.unsplash.com/photo-1560953689-dd06de818965?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1700000 },
    { name: 'Hotel Diego de Almagro Arica', category: 'Salones de eventos', location: 'Arica, Arica y Parinacota', city: 'Arica', rating: 4.5, description: 'Con la confianza de una gran cadena, ofrecemos salones equipados y un servicio profesional para asegurar que tu matrimonio sea perfecto.', imageUrl: 'https://images.unsplash.com/photo-1580252192257-a9a7a1334812?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1600000 },
    { name: 'Parcela de Eventos Pukará', category: 'Salones de eventos', location: 'Valle de Lluta, Arica y Parinacota', city: 'Arica', rating: 4.8, description: 'Celebra en un entorno natural único en el Valle de Lluta. Amplios espacios al aire libre y un salón rústico lleno de encanto.', imageUrl: 'https://images.unsplash.com/photo-1522036496963-3f86e06a64b9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1500000 },
    { name: 'Hotel Gavina Iquique', category: 'Salones de eventos', location: 'Iquique, Tarapacá', city: 'Iquique', rating: 4.7, description: 'Celebra con la brisa marina y una vista espectacular al Pacífico.', imageUrl: 'https://images.unsplash.com/photo-1560953689-dd06de818965?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2100000 },
    { name: 'Enjoy Antofagasta', category: 'Salones de eventos', location: 'Antofagasta, Antofagasta', city: 'Antofagasta', rating: 4.8, description: 'Lujo, entretención y salones de primer nivel para una boda inolvidable.', imageUrl: 'https://images.unsplash.com/photo-1606049255628-a40387a216f9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3400000 },
    { name: 'Hotel W Santiago', category: 'Salones de eventos', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 5.0, description: 'La opción más chic y cosmopolita para una boda urbana de lujo.', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 6000000, isPremium: true },
    { name: 'Hotel Dreams Pedro de Valdivia', category: 'Salones de eventos', location: 'Valdivia, Los Ríos', city: 'Valdivia', rating: 4.8, description: 'Elegancia y servicio de primera a orillas del río Calle-Calle.', imageUrl: 'https://images.unsplash.com/photo-1580252192257-a9a7a1334812?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2400000 },
    { name: 'Hotel Cabaña del Lago', category: 'Salones de eventos', location: 'Puerto Varas, Los Lagos', city: 'Puerto Varas', rating: 4.9, description: 'Vistas inmejorables al Lago Llanquihue y los volcanes. Un marco incomparable.', imageUrl: 'https://images.unsplash.com/photo-1511285560921-4c9292848e27?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3700000 },
    { name: 'Centro de Eventos El Arrayán', category: 'Salones de eventos', location: 'Lo Barnechea, Metropolitana de Santiago', city: 'Lo Barnechea', rating: 4.7, description: 'Un oasis de naturaleza en Santiago para una boda con aire campestre.', imageUrl: 'https://images.unsplash.com/photo-1620322231579-d576359042b3?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2900000 },
    { name: 'Casona Aldunate', category: 'Salones de eventos', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.8, description: 'Monumento histórico en el corazón de Santiago para una boda con carácter y elegancia.', imageUrl: 'https://images.unsplash.com/photo-1522036496963-3f86e06a64b9?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3100000 },
    { name: 'Club de Campo Las Vizcachas', category: 'Salones de eventos', location: 'Puente Alto, Metropolitana de Santiago', city: 'Puente Alto', rating: 4.6, description: 'Amplios espacios y áreas verdes para una gran celebración familiar.', imageUrl: 'https://images.unsplash.com/photo-1587899763374-b8a9de193158?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2300000 },
    
    // --- Banquetes ---
    { name: 'Gastronomía de Reyes', category: 'Banquetes', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 5.0, description: 'Alta cocina para un día inolvidable. Menús personalizados y servicio de excelencia.', imageUrl: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 80000, isPremium: true },
    { name: 'El Festín Banquetes', category: 'Banquetes', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.7, description: 'Sabores que cuentan historias. Nos adaptamos a tu estilo y presupuesto.', imageUrl: 'https://images.unsplash.com/photo-1505253716362-af78f5d115de?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 65000 },
    { name: 'Amelia Correa Gastronomía', category: 'Banquetes', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Cocina de autor para bodas con un sello de sofisticación y creatividad.', imageUrl: 'https://images.unsplash.com/photo-1621863269040-2715e7174b04?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 95000 },
    { name: 'Sabores del Sur Banquetería', category: 'Banquetes', location: 'Temuco, La Araucanía', city: 'Temuco', rating: 4.8, description: 'Rescatamos los sabores locales para crear menús de boda únicos y deliciosos.', imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 55000 },
    { name: 'Banquetería Costa', category: 'Banquetes', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Especialistas en productos del mar y cocina fusión para bodas frente a la costa.', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 72000 },
    { name: 'Del Fuego a la Mesa', category: 'Banquetes', location: 'Rancagua, O\'Higgins', city: 'Rancagua', rating: 4.9, description: 'Expertos en asados campestres y parrillas premium para matrimonios relajados.', imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6b5f46b54?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 60000 },
    { name: 'Azafrán Catering', category: 'Banquetes', location: 'La Serena, Coquimbo', city: 'La Serena', rating: 4.7, description: 'Cocina mediterránea con ingredientes frescos de la región. Calidad y sabor.', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 68000 },
    { name: 'Sofía Jottar Eventos', category: 'Banquetes', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 5.0, description: 'Una de las banqueteras más reconocidas, sinónimo de calidad y elegancia.', imageUrl: 'https://images.unsplash.com/photo-1505253716362-af78f5d115de?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 110000, isPremium: true },
    { name: 'Catering Sureño', category: 'Banquetes', location: 'Puerto Varas, Los Lagos', city: 'Puerto Varas', rating: 4.9, description: 'Productos frescos del sur en preparaciones gourmet para tu boda.', imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 75000 },
    { name: 'Banquetería del Desierto', category: 'Banquetes', location: 'Antofagasta, Antofagasta', city: 'Antofagasta', rating: 4.8, description: 'Sabores del mar y la tierra nortina para una experiencia gastronómica única.', imageUrl: 'https://images.unsplash.com/photo-1621863269040-2715e7174b04?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 70000 },
    { name: 'Cocina Itata', category: 'Banquetes', location: 'Quirihue, Ñuble', city: 'Quirihue', rating: 4.9, description: 'Rescatamos las recetas del Valle del Itata para una boda con sabor a campo chileno.', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 58000 },

    // --- Música y DJ ---
    { name: 'Fiesta Total DJ', category: 'Música y DJ', location: 'Santiago Centro, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'La mejor música y animación para que tu fiesta de bodas sea inolvidable.', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 350000 },
    { name: 'Pro DJ Eventos', category: 'Música y DJ', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 5.0, description: 'Servicio premium de DJ, iluminación y sonido profesional para bodas de alto nivel.', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 500000, isPremium: true },
    { name: 'Ritmo Sur DJ', category: 'Música y DJ', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.8, description: 'Ponemos a todos a bailar. Expertos en crear el ambiente perfecto para tu fiesta.', imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 300000 },
    { name: 'Santiago Music Band', category: 'Música y DJ', location: 'Ñuñoa, Metropolitana de Santiago', city: 'Ñuñoa', rating: 4.9, description: 'Banda en vivo con un repertorio versátil para animar tu cóctel y fiesta.', imageUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 700000 },
    { name: 'DJ Beat Viña', category: 'Música y DJ', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.7, description: 'La mejor selección musical para matrimonios en la V Región. Pista llena garantizada.', imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 320000 },
    { name: 'DJ Groove Antofagasta', category: 'Música y DJ', location: 'Antofagasta, Antofagasta', city: 'Antofagasta', rating: 4.8, description: 'Ponemos el ritmo en el norte. Equipos de alta gama y DJs profesionales.', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 400000 },
    { name: 'Audio Austral', category: 'Música y DJ', location: 'Punta Arenas, Magallanes', city: 'Punta Arenas', rating: 4.9, description: 'La mejor música para tu fiesta en la Patagonia. Nos adaptamos a todos los estilos.', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 450000 },

    // --- Pastelerías de boda ---
    { name: 'Dulce Encanto Viña', category: 'Pastelerías de boda', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.9, description: 'Tortas de novios de diseño, personalizadas para reflejar tu historia de amor.', imageUrl: 'https://images.unsplash.com/photo-1586956241220-14197da72983?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 90000 },
    { name: 'Pastelería La Celeste', category: 'Pastelerías de boda', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 5.0, description: 'Arte en azúcar. Creamos tortas de boda espectaculares y deliciosas.', imageUrl: 'https://images.unsplash.com/photo-1616690710400-a15d4bcc8712?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 120000, isPremium: true },
    { name: 'Sweet Dreams Concepción', category: 'Pastelerías de boda', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.8, description: 'Tortas y mesas dulces que son un sueño hecho realidad. Sabores inolvidables.', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 85000 },
    { name: 'Manjares del Sur', category: 'Pastelerías de boda', location: 'Puerto Varas, Los Lagos', city: 'Puerto Varas', rating: 4.9, description: 'Pastelería fina con ingredientes locales. Tortas que celebran los sabores de la Patagonia.', imageUrl: 'https://images.unsplash.com/photo-1571114570293-21c3be30248a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 110000 },
    { name: 'Candelle', category: 'Pastelerías de boda', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 5.0, description: 'Alta pastelería francesa para tu boda. Un toque de distinción y sabor inigualable.', imageUrl: 'https://images.unsplash.com/photo-1586956241220-14197da72983?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 150000, isPremium: true },
    { name: 'Dulce Atacama', category: 'Pastelerías de boda', location: 'Copiapó, Atacama', city: 'Copiapó', rating: 4.7, description: 'Tortas de novios y dulces con frutos de la zona, como el copao. Sabor único.', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 95000 },

    // --- Wedding Planners ---
    { name: 'Bodas con Alma Planners', category: 'Wedding Planners', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 5.0, description: 'Organización integral de bodas. Nos encargamos de todo para que solo te preocupes de disfrutar.', imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1200000, isPremium: true },
    { name: 'Sí, Acepto Producciones', category: 'Wedding Planners', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 4.9, description: 'Diseñamos y producimos bodas memorables, cuidando cada detalle.', imageUrl: 'https://images.unsplash.com/photo-1583922349314-521b2a265985?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1500000 },
    { name: 'Coordina Tu Boda', category: 'Wedding Planners', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Expertas en bodas en la V Región. Hacemos tu sueño realidad.', imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 900000 },
    { name: 'Detalles del Sur Planners', category: 'Wedding Planners', location: 'Puerto Varas, Los Lagos', city: 'Puerto Varas', rating: 5.0, description: 'Especialistas en destination weddings en la Patagonia Chilena. Experiencias únicas.', imageUrl: 'https://images.unsplash.com/photo-1521587514321-23a4b7f841b6?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1800000 },
    { name: 'Matrimonios Pro', category: 'Wedding Planners', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Planificación de bodas de lujo. Experiencia, exclusividad y profesionalismo.', imageUrl: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2000000, isPremium: true },
    { name: 'Atacama Wedding Planner', category: 'Wedding Planners', location: 'San Pedro de Atacama, Antofagasta', city: 'San Pedro', rating: 5.0, description: 'Organizamos tu boda o elopement en los paisajes mágicos de San Pedro de Atacama.', imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2200000 },
    { name: 'Bodas de la Araucanía', category: 'Wedding Planners', location: 'Temuco, La Araucanía', city: 'Temuco', rating: 4.8, description: 'Planificamos tu boda con la magia y cultura del sur de Chile.', imageUrl: 'https://images.unsplash.com/photo-1583922349314-521b2a265985?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1100000 },

    // --- Decoración & Floristerías ---
    { name: 'Ambientes Mágicos Deco', category: 'Decoración', location: 'Concón, Valparaíso', city: 'Concón', rating: 4.8, description: 'Creamos escenografías únicas para tu boda. Iluminación, flores y detalles que enamoran.', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 600000 },
    { name: 'Diseño Floral La Pérgola', category: 'Floristerías', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'Arreglos florales espectaculares que transformarán tu celebración.', imageUrl: 'https://images.unsplash.com/photo-1579683344609-f1311f937989?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 450000 },
    { name: 'Flores de Ocoa', category: 'Floristerías', location: 'La Cruz, Valparaíso', city: 'La Cruz', rating: 5.0, description: 'Las flores más frescas y bellas directamente desde su origen para tu boda.', imageUrl: 'https://images.unsplash.com/photo-1533616688484-4b4a11f26106?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 400000, isPremium: true },
    { name: 'Deco Bodas Sur', category: 'Decoración', location: 'Temuco, La Araucanía', city: 'Temuco', rating: 4.7, description: 'Estilo rústico-chic para matrimonios en el sur. Calidez y elegancia natural.', imageUrl: 'https://images.unsplash.com/photo-1581898593452-78d2a585038c?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 550000 },
    { name: 'Arriendo & Deco Santiago', category: 'Decoración', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.8, description: 'Arriendo de mobiliario, vajilla y todo lo que necesitas para tu boda.', imageUrl: 'https://images.unsplash.com/photo-1575043642295-2a2817552a8a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 300000 },
    { name: 'Azahar Flores', category: 'Floristerías', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Diseño floral de vanguardia para novias que buscan algo diferente.', imageUrl: 'https://images.unsplash.com/photo-1579683344609-f1311f937989?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 600000 },
    { name: 'Iluminación Creativa', category: 'Decoración', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'Transformamos espacios con proyectos de iluminación profesional para bodas.', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 700000, isPremium: true },
    { name: 'Flor de Loto', category: 'Floristerías', location: 'Rancagua, O\'Higgins', city: 'Rancagua', rating: 4.8, description: 'Arreglos florales con un toque silvestre y romántico para tu boda.', imageUrl: 'https://images.unsplash.com/photo-1533616688484-4b4a11f26106?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 380000 },
    
    // --- Vestidos de novia ---
    { name: 'Atelier Blanco Puro', category: 'Vestidos de novia', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 5.0, description: 'Diseño y confección de vestidos de novia a medida. Estilo y elegancia para ti.', imageUrl: 'https://images.unsplash.com/photo-1595023313936-c3f2c3b21029?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 900000, isPremium: true },
    { name: 'Novias Chic Boutique', category: 'Vestidos de novia', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Las mejores marcas internacionales y una asesoría de imagen completa para novias.', imageUrl: 'https://images.unsplash.com/photo-1587398335436-5cf4b1a457a4?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 750000 },
    { name: 'La Casa Blanca Novias', category: 'Vestidos de novia', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Una selección exclusiva de diseñadores europeos y americanos para la novia moderna.', imageUrl: 'https://images.unsplash.com/photo-1543786098-0c2b64d3f54b?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1200000 },
    { name: 'Diseño Sur Novias', category: 'Vestidos de novia', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.7, description: 'Vestidos de novia con un toque bohemio y romántico, perfectos para bodas al aire libre.', imageUrl: 'https://images.unsplash.com/photo-1604347852445-3d843813dd11?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 650000 },
    { name: 'Nevada Novias', category: 'Vestidos de novia', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 5.0, description: 'Alta costura para novias. Representantes de marcas de lujo internacionales.', imageUrl: 'https://images.unsplash.com/photo-1595023313936-c3f2c3b21029?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2500000, isPremium: true },
    { name: 'Mi Vestido Blanco', category: 'Vestidos de novia', location: 'Temuco, La Araucanía', city: 'Temuco', rating: 4.8, description: 'Asesoría completa para encontrar el vestido que te haga sentir única.', imageUrl: 'https://images.unsplash.com/photo-1587398335436-5cf4b1a457a4?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 700000 },

    // --- Trajes de novio ---
    { name: 'Sastrería Italiana', category: 'Trajes de novio', location: 'Vitacura, Metropolitana de Santiago', city: 'Vitacura', rating: 4.9, description: 'Trajes a la medida con las mejores telas italianas. Elegancia y calce perfecto.', imageUrl: 'https://images.unsplash.com/photo-1523281723522-48744b369527?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 500000, isPremium: true },
    { name: 'El Novio Moderno', category: 'Trajes de novio', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.7, description: 'Arriendo y venta de chaqués, smokings y trajes de vanguardia.', imageUrl: 'https://images.unsplash.com/photo-1617137968427-41efa11b9b1d?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 150000 },
    { name: 'Sastrería del Puerto', category: 'Trajes de novio', location: 'Valparaíso, Valparaíso', city: 'Valparaíso', rating: 4.8, description: 'Estilo y tradición para el novio. Asesoría personalizada para un look impecable.', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 450000 },
    { name: 'Rubinstein', category: 'Trajes de novio', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Referente en vestuario masculino de ceremonia. Calidad y variedad de estilos.', imageUrl: 'https://images.unsplash.com/photo-1523281723522-48744b369527?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 350000 },
    { name: 'Gala Novios', category: 'Trajes de novio', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.7, description: 'Trajes para el novio y padrinos, con las últimas tendencias de la moda masculina.', imageUrl: 'https://images.unsplash.com/photo-1617137968427-41efa11b9b1d?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 280000 },

    // --- Joyerías ---
    { name: 'Joyería Aurum', category: 'Joyerías', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 5.0, description: 'Diseño y fabricación de argollas de matrimonio y anillos de compromiso a medida.', imageUrl: 'https://images.unsplash.com/photo-1599351372512-35a0a33a39e7?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 300000, isPremium: true },
    { name: 'Anillos del Sur', category: 'Joyerías', location: 'Puerto Varas, Los Lagos', city: 'Puerto Varas', rating: 4.8, description: 'Joyas inspiradas en la naturaleza del sur de Chile. Diseños únicos con identidad.', imageUrl: 'https://images.unsplash.com/photo-1611382943483-3d02d2f7defc?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 250000 },
    { name: 'Barón', category: 'Joyerías', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'Tradición y prestigio en joyería fina. Argollas clásicas y de diseño.', imageUrl: 'https://images.unsplash.com/photo-1599351372512-35a0a33a39e7?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 400000 },
    { name: 'La Joya del Pacífico', category: 'Joyerías', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Argollas de matrimonio con diseños exclusivos y materiales de la más alta calidad.', imageUrl: 'https://images.unsplash.com/photo-1611382943483-3d02d2f7defc?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 350000 },

    // --- Autos de matrimonio ---
    { name: 'Autos de Época', category: 'Autos de matrimonio', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'Llega a tu boda con estilo en uno de nuestros autos clásicos y de colección.', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 200000 },
    { name: 'Novios Sobre Ruedas', category: 'Autos de matrimonio', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Desde descapotables modernos hasta elegantes sedanes. El auto perfecto para tu día.', imageUrl: 'https://images.unsplash.com/photo-1614266323134-a82d3856d357?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 180000 },
    { name: 'Transfer de Lujo', category: 'Autos de matrimonio', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Servicio de transporte premium en vehículos de alta gama para novios e invitados.', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 250000, isPremium: true },
    { name: 'Auto Soñado Concepción', category: 'Autos de matrimonio', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.8, description: 'El toque de elegancia que tu llegada a la ceremonia necesita. Servicio impecable.', imageUrl: 'https://images.unsplash.com/photo-1614266323134-a82d3856d357?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 170000 },

    // --- Partes de matrimonio ---
    { name: 'Diseño Nupcial Papelería', category: 'Partes de matrimonio', location: 'Ñuñoa, Metropolitana de Santiago', city: 'Ñuñoa', rating: 4.9, description: 'Diseño de invitaciones y papelería para bodas. Estilos personalizados y de alta calidad.', imageUrl: 'https://images.unsplash.com/photo-1544929227-1c14c3b51b32?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2500 },
    { name: 'Tu Parte Ideal', category: 'Partes de matrimonio', location: 'Concepción, Biobío', city: 'Concepción', rating: 4.7, description: 'Invitaciones creativas y modernas que serán la mejor carta de presentación de tu boda.', imageUrl: 'https://images.unsplash.com/photo-1535406208535-42f50a0e98a7?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 2200 },
    { name: 'Amor de Papel', category: 'Partes de matrimonio', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 5.0, description: 'Papelería fina para bodas. Acuarelas, caligrafía y diseños exclusivos.', imageUrl: 'https://images.unsplash.com/photo-1544929227-1c14c3b51b32?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 3500, isPremium: true },

    // --- Belleza y Maquillaje ---
    { name: 'Estudio de Belleza Novias', category: 'Belleza y Maquillaje', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 5.0, description: 'Maquillaje y peinado profesional para novias. Resaltamos tu belleza natural.', imageUrl: 'https://images.unsplash.com/photo-1605345450422-a9b0a1d6a133?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 150000, isPremium: true },
    { name: 'Makeup & Hair Viña', category: 'Belleza y Maquillaje', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Servicio a domicilio para novias e invitadas. Look perfecto y duradero.', imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 120000 },
    
    // --- Luna de miel ---
    { name: 'Viajes de Ensueño', category: 'Luna de miel', location: 'Las Condes, Metropolitana de Santiago', city: 'Las Condes', rating: 4.9, description: 'Agencia especializada en lunas de miel. Creamos el viaje perfecto para ustedes.', imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1500000 },
    { name: 'Mundo Pacífico Viajes', category: 'Luna de miel', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.7, description: 'Destinos exóticos y paquetes todo incluido para una luna de miel sin preocupaciones.', imageUrl: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1200000 },

    // --- Cotillón y Recuerdos ---
    { name: 'Fiesta Loca Cotillón', category: 'Cotillón y Recuerdos', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.6, description: 'Todo para la hora loca. Artículos entretenidos y originales para animar tu fiesta.', imageUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 50000 },
    { name: 'Recuerdos Vivos', category: 'Cotillón y Recuerdos', location: 'Talagante, Metropolitana de Santiago', city: 'Talagante', rating: 4.8, description: 'Recuerdos de matrimonio ecológicos. Suculentas y semillas para tus invitados.', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 1500 },

    // --- Food trucks y carritos ---
    { name: 'Café Sobre Ruedas', category: 'Food trucks y carritos', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'Un carrito de café de especialidad para sorprender a tus invitados en el cóctel o trasnoche.', imageUrl: 'https://images.unsplash.com/photo-1595407753234-088204533243?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 250000 },
    { name: 'Helados Artesanales Móvil', category: 'Food trucks y carritos', location: 'Viña del Mar, Valparaíso', city: 'Viña del Mar', rating: 4.8, description: 'Un toque fresco y delicioso para tu boda de verano. Sabores 100% naturales.', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 300000 },

    // --- Animación de eventos ---
    { name: 'Magia y Humor Shows', category: 'Animación de eventos', location: 'Santiago, Metropolitana de Santiago', city: 'Santiago', rating: 4.9, description: 'Un show de magia de cerca o stand-up comedy para romper el hielo y entretener.', imageUrl: 'https://images.unsplash.com/photo-1515942259902-861c89a35e8a?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 350000 },
    { name: 'Bailarines Profesionales', category: 'Animación de eventos', location: 'Providencia, Metropolitana de Santiago', city: 'Providencia', rating: 4.7, description: 'Shows de baile temáticos (salsa, tango, etc.) para animar tu fiesta.', imageUrl: 'https://images.unsplash.com/photo-1542042161-d10f8a84d872?q=80&w=400&h=300&auto-format&fit=crop', startingPrice: 400000 },
];


export const MOCK_FEATURED_VENDORS: Vendor[] = MOCK_VENDORS.filter(v => v.isPremium).slice(0, 8);


export const MOCK_REAL_WEDDINGS: RealWedding[] = [
    {
        id: 'rw001',
        name: 'Daniela & Rodrigo',
        location: 'Chillán, Ñuble',
        photos: [
            'https://images.unsplash.com/photo-1597871442261-26884143431d?q=80&w=400&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1543306973-108873933e16?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1571424192451-f763025ec72e?q=80&w=200&auto-format&fit=crop',
        ]
    },
    {
        id: 'rw002',
        name: 'Caro & Magda',
        location: 'Paine, Maipo',
        photos: [
            'https://images.unsplash.com/photo-1509623903142-5c62bda3f393?q=80&w=400&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1560953689-dd06de818965?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1533246200215-9ea4459468e2?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1558961166-26a9f4549f91?q=80&w=200&auto-format&fit=crop',
        ]
    },
    {
        id: 'rw003',
        name: 'Fabiola & Alberto',
        location: 'San José de Maipo, Cordillera',
        photos: [
            'https://images.unsplash.com/photo-1525997429365-d62194de8256?q=80&w=400&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1519225383533-5c31c0ae1c4e?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1505942634591-933a2027ba19?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1522008338728-4e50d87def37?q=80&w=200&auto-format&fit=crop',
        ]
    },
     {
        id: 'rw004',
        name: 'Camila & Sergio',
        location: 'Paine, Maipo',
        photos: [
            'https://images.unsplash.com/photo-1567303314286-93c64a5113d1?q=80&w=400&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1595407753234-088204533243?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1527578402222-c6e60b16b29b?q=80&w=200&auto-format&fit=crop',
            'https://images.unsplash.com/photo-1587329323110-A873c14482a5?q=80&w=200&auto-format&fit=crop',
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

export const MOCK_CHECKLIST: ChecklistItem[] = [
    { id: 1, task: 'Definir el presupuesto general de la boda', category: '12+ Meses Antes', completed: false },
    { id: 2, task: 'Crear una lista de invitados preliminar', category: '12+ Meses Antes', completed: false },
    { id: 3, task: 'Contratar un wedding planner (opcional)', category: '12+ Meses Antes', completed: false },
    { id: 4, task: 'Elegir y reservar el lugar de la ceremonia y la recepción', category: '9-12 Meses Antes', completed: false },
    { id: 5, task: 'Contratar fotógrafo y videógrafo', category: '9-12 Meses Antes', completed: false },
    { id: 6, task: 'Contratar servicio de banquetería', category: '9-12 Meses Antes', completed: false },
    { id: 7, task: 'Comprar el vestido de novia', category: '6-9 Meses Antes', completed: false },
    { id: 8, task: 'Enviar los "Save the Date"', category: '6-9 Meses Antes', completed: false },
    { id: 9, task: 'Contratar música (DJ o banda)', category: '6-9 Meses Antes', completed: false },
    { id: 10, task: 'Reservar el viaje de luna de miel', category: '3-6 Meses Antes', completed: false },
    { id: 11, task: 'Comprar el traje del novio', category: '3-6 Meses Antes', completed: false },
    { id: 12, task: 'Encargar las invitaciones de boda', category: '3-6 Meses Antes', completed: false },
    { id: 13, task: 'Comprar los anillos de boda', category: '1-3 Meses Antes', completed: false },
    { id: 14, task: 'Realizar prueba de peinado y maquillaje', category: '1-3 Meses Antes', completed: false },
    { id: 15, task: 'Enviar las invitaciones', category: '1-3 Meses Antes', completed: false },
    { id: 16, task: 'Confirmar asistencia de invitados (RSVP)', category: 'Último Mes', completed: false },
    { id: 17, task: 'Crear el seating plan (distribución de mesas)', category: 'Último Mes', completed: false },
    { id: 18, task: 'Confirmar todos los detalles con los proveedores', category: 'Semana de la Boda', completed: false },
    { id: 19, task: 'Preparar un kit de emergencia para el día de la boda', category: 'Semana de la Boda', completed: false },
    { id: 20, task: '¡Disfrutar del día de tu boda!', category: 'Día de la Boda', completed: false },
];

export const MOCK_BUDGET_TEMPLATE: BudgetItem[] = [
    { id: 1, item: 'Arriendo de lugar', category: 'Recepción y Banquete', estimated: 1500000, actual: 0 },
    { id: 2, item: 'Banquete (por persona)', category: 'Recepción y Banquete', estimated: 50000, actual: 0 },
    { id: 3, item: 'Bar abierto y bebestibles', category: 'Recepción y Banquete', estimated: 500000, actual: 0 },
    { id: 4, item: 'Fotógrafo', category: 'Fotografía y Video', estimated: 600000, actual: 0 },
    { id: 5, item: 'Videógrafo', category: 'Fotografía y Video', estimated: 450000, actual: 0 },
    { id: 6, item: 'Vestido de novia', category: 'Vestuario y Belleza', estimated: 700000, actual: 0 },
    { id: 7, item: 'Traje de novio', category: 'Vestuario y Belleza', estimated: 300000, actual: 0 },
    { id: 8, item: 'Maquillaje y peinado', category: 'Vestuario y Belleza', estimated: 150000, actual: 0 },
    { id: 9, item: 'Música (DJ o banda)', category: 'Varios', estimated: 400000, actual: 0 },
    { id: 10, item: 'Decoración y flores', category: 'Varios', estimated: 500000, actual: 0 },
    { id: 11, item: 'Torta de novios', category: 'Varios', estimated: 100000, actual: 0 },
    { id: 12, item: 'Anillos', category: 'Varios', estimated: 250000, actual: 0 },
];

export const MOCK_FAQS: FAQItem[] = [
    { 
        question: '¿Con cuánta antelación debo reservar sus servicios de {category}?', 
        answer: 'Recomendamos reservar con al menos 6 a 12 meses de antelación, especialmente para fechas populares. En {name} nos gusta planificar todo con tiempo para asegurar la disponibilidad.' 
    },
    { 
        question: '¿Ofrecen paquetes personalizables?', 
        answer: '¡Absolutamente! En {name} entendemos que cada boda es única. Ofrecemos varios paquetes base que podemos personalizar completamente para adaptarnos a sus necesidades y presupuesto.' 
    },
    { 
        question: '¿Cuál es su política de cancelación o reprogramación?', 
        answer: 'Nuestra política es flexible. Entendemos que pueden surgir imprevistos. Por favor, contáctanos directamente para discutir los detalles específicos de tu contrato en caso de necesitar un cambio.' 
    },
    { 
        question: '¿Trabajan con otros proveedores? ¿Tienen recomendaciones?', 
        answer: 'Sí, a lo largo de los años hemos colaborado con excelentes profesionales del rubro. Estaremos encantados de compartir algunas recomendaciones si lo necesitas.' 
    },
];

export const CATEGORY_DETAILS: { [key: string]: { icon: React.ReactElement<React.SVGProps<SVGSVGElement>>, description: string } } = {
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