import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import { UserIcon } from '../icons/UserIcon';

const AdminHeader: React.FC = () => {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 flex-shrink-0">
            <div className="relative w-full max-w-xs">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar proveedor, usuario..."
                    className="w-full bg-gray-100 border-transparent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>
            <div className="flex items-center">
                <button className="flex items-center">
                    <img
                        src="https://i.pravatar.cc/40?u=superadmin"
                        alt="Superadmin Avatar"
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="ml-2 font-semibold text-sm text-gray-700">Superadmin</span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
