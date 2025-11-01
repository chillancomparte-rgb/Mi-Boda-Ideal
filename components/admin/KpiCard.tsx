import React from 'react';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';

interface KpiCardProps {
    title: string;
    value: string;
    // FIX: The icon prop type was too generic, causing an error when cloning.
    // Specifying React.ReactElement<React.SVGProps<SVGSVGElement>> informs TypeScript
    // that the icon accepts SVG props like 'className', resolving the overload error.
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    trend: string;
    trendDirection: 'up' | 'down';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, trend, trendDirection }) => {
    const trendColor = trendDirection === 'up' ? 'text-green-500' : 'text-red-500';
    const TrendIcon = trendDirection === 'up' ? ArrowUpIcon : ArrowDownIcon;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className="bg-brand-light text-brand-primary p-3 rounded-full">
                    {React.cloneElement(icon, { className: "h-6 w-6" })}
                </div>
            </div>
            <div className={`mt-4 flex items-center text-sm ${trendColor}`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                <span>{trend}</span>
                <span className="text-gray-400 ml-1">vs el mes anterior</span>
            </div>
        </div>
    );
};

export default KpiCard;