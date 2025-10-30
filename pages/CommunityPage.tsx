import React from 'react';
import CommunityPostCard from '../components/community/CommunityPostCard';
import SeoMeta from '../components/SeoMeta';
import type { CommunityPost } from '../types';

// Mock data for community posts
const mockPosts: CommunityPost[] = [
    {
        id: 1,
        author: 'Ana Morales',
        authorAvatar: 'https://i.pravatar.cc/40?u=1',
        timestamp: 'hace 2 horas',
        content: '¡Hola a todos! ¿Alguien tiene recomendaciones de fotógrafos en la región de Valparaíso que tengan un estilo más documental? ¡Gracias!',
        likes: 12,
        comments: 5,
    },
    {
        id: 2,
        author: 'Carlos Soto',
        authorAvatar: 'https://i.pravatar.cc/40?u=2',
        timestamp: 'hace 5 horas',
        content: '¡Acabamos de reservar nuestro salón! Fue un proceso largo pero estamos felices. Un consejo: visiten al menos 3 lugares antes de decidir. ¡La diferencia en persona es enorme!',
        likes: 34,
        comments: 10,
    },
    {
        id: 3,
        author: 'Laura Jiménez',
        authorAvatar: 'https://i.pravatar.cc/40?u=3',
        timestamp: 'hace 1 día',
        content: '¿Alguien ha hecho una boda "unplugged" (sin celulares)? Me tienta la idea pero no sé cómo comunicarlo a los invitados sin sonar pesada. ¿Consejos?',
        likes: 25,
        comments: 18,
    }
];

const CommunityPage: React.FC = () => {
    return (
        <div className="bg-brand-light">
            <SeoMeta
                title="Comunidad de Novios | Mi Boda Ideal"
                description="Únete a la conversación. Comparte tus dudas, encuentra consejos y conecta con otras parejas que están planificando su boda."
            />
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif font-bold text-brand-dark">Comunidad</h1>
                    <p className="text-lg text-brand-dark opacity-80 mt-4 max-w-2xl mx-auto">Conecta con otras parejas, comparte experiencias y resuelve tus dudas.</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* New Post Input */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                        <textarea
                            className="w-full p-2 border border-gray-200 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="Escribe tu pregunta o comparte tu idea..."
                            rows={3}
                        ></textarea>
                        <div className="text-right mt-2">
                            <button className="bg-brand-primary text-white font-bold py-2 px-6 rounded-full hover:bg-brand-accent transition-colors">
                                Publicar
                            </button>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {mockPosts.map(post => (
                            <CommunityPostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;