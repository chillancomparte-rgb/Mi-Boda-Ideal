import React from 'react';
import type { CommunityPost } from '../../types';
import { HeartIcon } from '../icons/HeartIcon';
import { MessageCircleIcon } from '../icons/MessageCircleIcon';

interface CommunityPostCardProps {
    post: CommunityPost;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
                <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full mr-4" />
                <div>
                    <p className="font-bold text-brand-dark">{post.author}</p>
                    <p className="text-xs text-brand-dark opacity-60">{post.timestamp}</p>
                </div>
            </div>
            <p className="text-brand-dark opacity-90 mb-4">{post.content}</p>
            <div className="flex items-center text-brand-dark opacity-70 space-x-6 border-t pt-3">
                <button className="flex items-center hover:text-brand-primary transition-colors">
                    <HeartIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{post.likes} Me gusta</span>
                </button>
                <button className="flex items-center hover:text-brand-primary transition-colors">
                    <MessageCircleIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{post.comments} Comentarios</span>
                </button>
            </div>
        </div>
    );
};

export default CommunityPostCard;