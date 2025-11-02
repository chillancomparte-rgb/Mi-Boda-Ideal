import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { SendIcon } from '../icons/SendIcon';
import { SearchIcon } from '../icons/SearchIcon';
import Spinner from '../Spinner';

// NOTE: This is a simplified chat implementation.
// A real-world app would need a more robust user/vendor data fetching mechanism.

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
}

interface Conversation {
    id: string;
    participants: string[];
    lastMessage: string;
    timestamp: any;
    // You'd likely fetch user details based on participants array
    otherUserName: string; 
    otherUserAvatar: string;
}

const VendorMessages: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Fetch conversations
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const convos: Conversation[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // This is a simplification. You'd fetch the other user's data.
                const otherUserId = data.participants.find((p: string) => p !== user.uid) || 'Usuario';
                convos.push({
                    id: doc.id,
                    ...data,
                    otherUserName: `Cliente ${otherUserId.substring(0,5)}`,
                    otherUserAvatar: `https://i.pravatar.cc/150?u=${otherUserId}`
                } as Conversation);
            });
            setConversations(convos.sort((a, b) => b.timestamp - a.timestamp));
            setIsLoading(false);
            if (!activeConversationId && convos.length > 0) {
                setActiveConversationId(convos[0].id);
            }
        });

        return () => unsubscribe();
    }, [user, activeConversationId]);

    // Fetch messages for the active conversation
    useEffect(() => {
        if (!activeConversationId) return;

        const messagesQuery = query(collection(db, 'conversations', activeConversationId, 'messages'), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const msgs: Message[] = [];
            querySnapshot.forEach(doc => {
                msgs.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [activeConversationId]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId || !user) return;

        setIsSending(true);
        const conversationRef = doc(db, 'conversations', activeConversationId);
        const messagesRef = collection(conversationRef, 'messages');

        try {
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: user.uid,
                timestamp: serverTimestamp(),
            });
            // This would typically be a cloud function trigger
            // await updateDoc(conversationRef, { lastMessage: newMessage, timestamp: serverTimestamp() });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-12rem)] flex">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-2xl font-serif font-bold text-brand-dark">Mensajes</h3>
                    <div className="relative mt-4">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" placeholder="Buscar mensajes..." className="w-full bg-gray-100 border-transparent rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(convo => (
                        <div
                            key={convo.id}
                            className={`p-4 flex items-center cursor-pointer hover:bg-brand-light ${activeConversationId === convo.id ? 'bg-brand-light' : ''}`}
                            onClick={() => setActiveConversationId(convo.id)}
                        >
                            <img src={convo.otherUserAvatar} alt={convo.otherUserName} className="h-12 w-12 rounded-full mr-4" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-brand-dark truncate">{convo.otherUserName}</p>
                                <p className="text-sm text-gray-600 truncate pr-2">{convo.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="w-2/3 flex flex-col">
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex items-center">
                            <img src={activeConversation.otherUserAvatar} alt={activeConversation.otherUserName} className="h-10 w-10 rounded-full mr-3" />
                            <h4 className="font-semibold text-lg text-brand-dark">{activeConversation.otherUserName}</h4>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex mb-4 ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-lg px-4 py-3 rounded-2xl ${msg.senderId === user?.uid ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    disabled={isSending}
                                />
                                <button type="submit" disabled={isSending} className="ml-3 bg-brand-primary hover:bg-brand-accent text-white rounded-full p-3 flex-shrink-0 disabled:bg-gray-400">
                                    <SendIcon className="h-6 w-6" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>{conversations.length > 0 ? 'Selecciona una conversación para empezar a chatear.' : 'No tienes mensajes.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorMessages;