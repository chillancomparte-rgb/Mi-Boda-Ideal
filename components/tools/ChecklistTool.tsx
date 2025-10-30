import React, { useState, useEffect, useMemo } from 'react';
import type { ChecklistItem } from '../../types';
import { generateChecklist } from '../../services/geminiService';
import Spinner from '../Spinner';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';

const LOCAL_STORAGE_KEY = 'miBodaIdealChecklist';

const ChecklistTool: React.FC = () => {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadChecklist = async (forceRefetch = false) => {
        setIsLoading(true);
        const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedItems && !forceRefetch) {
            setItems(JSON.parse(savedItems));
        } else {
            const checklist = await generateChecklist();
            setItems(checklist);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadChecklist();
    }, []);

    useEffect(() => {
        if (items.length > 0 && !isLoading) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoading]);

    const toggleItem = (id: number) => {
        setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const handleReset = () => {
        if (window.confirm('¿Seguro que quieres reiniciar la lista? Se borrará tu progreso y se generará una nueva.')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            loadChecklist(true);
        }
    };

    const groupedItems: Record<string, ChecklistItem[]> = useMemo(() => {
        return items.reduce((acc: Record<string, ChecklistItem[]>, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {} as Record<string, ChecklistItem[]>);
    }, [items]);

    const completedCount = useMemo(() => items.filter(item => item.completed).length, [items]);
    const totalCount = items.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    if (isLoading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Tu Checklist de Boda</h2>
                <button 
                    onClick={handleReset} 
                    className="flex items-center text-xs text-brand-dark opacity-70 hover:opacity-100 font-medium"
                    title="Reiniciar lista"
                >
                    <RefreshCwIcon className="h-4 w-4 mr-1"/>
                    Reiniciar
                </button>
            </div>
            
            <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-brand-dark opacity-80">Progreso Total</span>
                    <span className="text-sm font-medium text-brand-primary">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold text-brand-dark border-b-2 border-brand-secondary pb-1 mb-3">{category}</h3>
                        <ul className="space-y-2">
                            {categoryItems.map(item => (
                                <li key={item.id} className="flex items-center">
                                    <label className="flex items-center cursor-pointer w-full p-2 rounded-md hover:bg-brand-light transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => toggleItem(item.id)}
                                            className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        />
                                        <span className={`ml-3 text-brand-dark ${item.completed ? 'line-through opacity-50' : 'opacity-90'}`}>
                                            {item.task}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChecklistTool;