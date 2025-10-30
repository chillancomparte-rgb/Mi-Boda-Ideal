import React, { useState, useEffect, useRef } from 'react';
import type { Vendor, ChatMessage } from '../../types';
import { SendIcon } from '../icons/SendIcon';

interface ChatWidgetProps {
    vendor: Vendor;
}

const getWelcomeMessage = (vendor: Vendor): string => {
    switch (vendor.category) {
        case "Fotógrafos":
            return `¡Hola! Gracias por tu interés en ${vendor.name}. Cuéntame un poco sobre la visión que tienes para las fotos de tu boda.`;
        case "Salones de eventos":
            return `¡Hola! Soy de ${vendor.name}. ¿Qué tipo de ambiente sueñas para tu gran día? Estoy aquí para ayudarte a encontrar el espacio perfecto.`;
        case "Banquetes":
            return `¡Hola! De parte de todo el equipo de ${vendor.name}, te damos la bienvenida. ¿Hay algún estilo de cocina o plato que te gustaría para tu celebración?`;
        case "Pastelerías de boda":
            return `¡Hola! Bienvenido/a a ${vendor.name}. ¿Ya tienes alguna idea sobre los sabores o el diseño de tu torta de bodas soñada?`;
        case "Música y DJ":
            return `¡Hola! Soy de ${vendor.name}. ¿Qué tipo de música no puede faltar para que tu fiesta sea inolvidable?`;
        default:
            return `¡Hola! Gracias por contactar a ${vendor.name}. ¿Cómo podemos ayudarte a planificar el día de tu boda?`;
    }
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ vendor }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsTyping(true);
        const typingTimeout = setTimeout(() => {
            setIsTyping(false);
            setMessages([
                { id: 1, text: getWelcomeMessage(vendor), sender: 'vendor' }
            ]);
        }, 2000); // Simulate typing for 2 seconds

        return () => clearTimeout(typingTimeout);
    }, [vendor]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: newMessage.trim(),
            sender: 'user',
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col h-[60vh] max-h-[500px]">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-serif font-bold text-brand-dark text-lg text-center">Chatea con {vendor.name}</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'vendor' && (
                            <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center font-bold text-brand-primary shrink-0">
                                {vendor.name.charAt(0)}
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-sm rounded-2xl py-2 px-4 ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-light text-brand-dark rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                         <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center font-bold text-brand-primary shrink-0">
                            {vendor.name.charAt(0)}
                        </div>
                        <div className="bg-brand-light rounded-2xl rounded-bl-none py-2 px-4">
                           <div className="flex items-center justify-center gap-1 h-5">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t bg-white rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 w-full p-2 border border-gray-300 rounded-full focus:ring-brand-primary focus:border-brand-primary text-sm"
                        disabled={isTyping}
                    />
                    <button type="submit" className="bg-brand-primary text-white p-2.5 rounded-full hover:bg-brand-accent transition-colors disabled:bg-gray-300" disabled={!newMessage || isTyping}>
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWidget;