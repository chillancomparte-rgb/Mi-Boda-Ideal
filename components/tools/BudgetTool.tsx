import React, { useState, useEffect, useMemo } from 'react';
import type { BudgetItem } from '../../types';
import { generateBudgetTemplate } from '../../services/geminiService';
import Spinner from '../Spinner';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';

const LOCAL_STORAGE_KEY = 'miBodaIdealBudget';

const BudgetTool: React.FC = () => {
    const [items, setItems] = useState<BudgetItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

     const loadBudget = async (forceRefetch = false) => {
        setIsLoading(true);
        const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedItems && !forceRefetch) {
            setItems(JSON.parse(savedItems));
        } else {
            const budget = await generateBudgetTemplate();
            setItems(budget);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadBudget();
    }, []);

    useEffect(() => {
        if (items.length > 0 && !isLoading) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoading]);

    const handleInputChange = (id: number, field: 'estimated' | 'actual', value: string) => {
        const numericValue = parseInt(value, 10) || 0;
        setItems(items.map(item => item.id === id ? { ...item, [field]: numericValue } : item));
    };
    
    const handleReset = () => {
        if (window.confirm('¿Seguro que quieres reiniciar el presupuesto? Se borrarán tus datos y se generará una nueva plantilla.')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            loadBudget(true);
        }
    };


    const { totalEstimated, totalActual } = useMemo(() => {
        return items.reduce(
            (totals, item) => {
                totals.totalEstimated += item.estimated;
                totals.totalActual += item.actual;
                return totals;
            },
            { totalEstimated: 0, totalActual: 0 }
        );
    }, [items]);

    const remaining = totalEstimated - totalActual;

    const groupedItems: Record<string, BudgetItem[]> = useMemo(() => {
        return items.reduce((acc: Record<string, BudgetItem[]>, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {} as Record<string, BudgetItem[]>);
    }, [items]);
    
    if (isLoading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Gestor de Presupuesto</h2>
                 <button 
                    onClick={handleReset} 
                    className="flex items-center text-xs text-brand-dark opacity-70 hover:opacity-100 font-medium"
                    title="Reiniciar presupuesto"
                >
                    <RefreshCwIcon className="h-4 w-4 mr-1"/>
                    Reiniciar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                <div className="bg-brand-light p-4 rounded-lg">
                    <p className="text-sm text-brand-dark opacity-70">Estimado Total</p>
                    <p className="text-2xl font-bold text-brand-dark">${totalEstimated.toLocaleString('es-CL')}</p>
                </div>
                <div className="bg-brand-secondary p-4 rounded-lg">
                    <p className="text-sm text-brand-dark opacity-70">Gastado Real</p>
                    <p className="text-2xl font-bold text-brand-accent">${totalActual.toLocaleString('es-CL')}</p>
                </div>
                 <div className={`p-4 rounded-lg ${remaining >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className={`text-sm ${remaining >= 0 ? 'text-green-900' : 'text-red-900'}`}>Restante</p>
                    <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-800' : 'text-red-800'}`}>${remaining.toLocaleString('es-CL')}</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Ítem</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Estimado</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-brand-dark opacity-60 uppercase tracking-wider">Real</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Object.entries(groupedItems).map(([category, categoryItems]) => (
                            <React.Fragment key={category}>
                                <tr>
                                    <td colSpan={3} className="bg-brand-light px-4 py-2 text-sm font-bold text-brand-dark">{category}</td>
                                </tr>
                                {categoryItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-4 whitespace-nowrap text-sm text-brand-dark opacity-90">{item.item}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <input type="number" value={item.estimated} onChange={e => handleInputChange(item.id, 'estimated', e.target.value)} className="w-32 p-1 border rounded-md" />
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <input type="number" value={item.actual} onChange={e => handleInputChange(item.id, 'actual', e.target.value)} className="w-32 p-1 border rounded-md" />
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetTool;