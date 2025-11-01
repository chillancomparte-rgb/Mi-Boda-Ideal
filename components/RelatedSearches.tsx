import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface RelatedSearchesProps {
    searches: string[];
}

const RelatedSearches: React.FC<RelatedSearchesProps> = ({ searches }) => {
    return (
        <section>
            <h3 className="text-lg font-serif font-bold text-brand-dark mb-3">Búsquedas Relacionadas</h3>
            <div className="space-y-2">
                {searches.map((search, index) => (
                    <a
                        key={index}
                        href="#"
                        onClick={(e) => e.preventDefault()} // In a real app, this would trigger a new search
                        className="flex items-center p-2 text-sm text-brand-dark opacity-80 rounded-md hover:bg-brand-light hover:opacity-100 transition-colors"
                    >
                        <SearchIcon className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{search}</span>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default RelatedSearches;
