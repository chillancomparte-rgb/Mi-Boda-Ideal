import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface UserAnnouncementProps {
    vendorMessage: string;
    clientMessage: string;
    onClose: () => void;
}

const UserAnnouncement: React.FC<UserAnnouncementProps> = ({ vendorMessage, clientMessage, onClose }) => {
    const { user } = useAuth();
    let messageToShow = '';

    if (user?.role === 'vendor' && vendorMessage) {
        messageToShow = vendorMessage;
    } else if (user?.role === 'user' && clientMessage) {
        messageToShow = clientMessage;
    }

    if (!messageToShow) return null;

    return (
        <div className="bg-purple-500 text-white p-3 text-center relative">
            <p className="text-sm font-medium">{messageToShow}</p>
            <button
                onClick={onClose}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none"
            >
                &times;
            </button>
        </div>
    );
};

export default UserAnnouncement;
