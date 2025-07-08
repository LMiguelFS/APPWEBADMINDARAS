import React from 'react';

// Ejemplo de props para KPICards
type KPICardsProps = {
    ingresos: number;
    ganancia: number;
    ordenes: number;
    productos?: string;
    topProduct?: string;
    loading?: boolean;
};

const KPICards: React.FC<KPICardsProps> = ({ ingresos, ganancia, ordenes }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Ingresos</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +12.5%
                </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">S/ {ingresos.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Ganancia</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    +8.1%
                </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">S/ {ganancia.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Órdenes</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    +5.3%
                </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{ordenes}</p>
        </div>
    </div>
);

export default KPICards;
