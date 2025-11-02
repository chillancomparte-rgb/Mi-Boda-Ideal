import React from 'react';

interface GeneralAnnouncementProps {
    message: string;
    onClose: () => void;
}

const GeneralAnnouncement: React.FC<GeneralAnnouncementProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="bg-blue-500 text-white p-3 text-center relative">
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none"
            >
                &times;
            </button>
        </div>
    );
};

export default GeneralAnnouncement;
