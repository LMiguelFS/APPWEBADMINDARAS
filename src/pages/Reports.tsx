import React, { useEffect, useState } from 'react';
import { Download, BarChart3, PieChart } from 'lucide-react';
import DateRangeFilter, { DateRangeType } from '../components/reports/DateRangeFilter';
import KPICards from '../components/reports/KPICards';
import { adminService } from '../services/adminService';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

import axios from 'axios';

const Reports: React.FC = () => {
    const [dateRange, setDateRange] = useState<DateRangeType>('month');
    const [customDates, setCustomDates] = useState<{ start: string; end: string }>({
        start: '',
        end: ''
    });
    const [kpi, setKPI] = useState<{
        totalVentas: number;
        totalProductos: number;
        rango: { inicio: string; fin: string };
    }>({
        totalVentas: 0,
        totalProductos: 0,
        rango: { inicio: '', fin: '' }
    });
    const [productosVendidos, setProductosVendidos] = useState<
        { product: string; cantidad_vendida: number; total_generado: number }[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [chartView, setChartView] = useState<'productos' | 'pagos'>('productos');
    const [paymentMethods, setPaymentMethods] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchDailyReport = async () => {
            if (dateRange === 'custom' && customDates.start && customDates.end) {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://api3.darasglowcandle.site/api/reports/sales/daily`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start_date: customDates.start,
                        end_date: customDates.end,
                        type: 'personalized'
                    }),
                });
                const json = await response.json();
                setPaymentMethods(json.data.metrics.payment_methods || {});
            }
        };


        const fetchKPI = async () => {
            setLoading(true);
            try {
                let data;
                if (dateRange === 'custom' && customDates.start && customDates.end) {
                    data = await adminService.getSalesAnalytics('custom', customDates.start, customDates.end);
                } else {
                    data = await adminService.getSalesAnalytics(dateRange);
                }
                setKPI({
                    totalVentas: parseFloat(data.total_ventas ?? 0),
                    totalProductos: data.total_productos ?? 0,
                    rango: data.rango_consultado ?? { inicio: '', fin: '' }
                });
                setProductosVendidos(data.productos_vendidos ?? []);
                setPaymentMethods(data.payment_methods ?? {});
            } catch (e) {
                setKPI({ totalVentas: 0, totalProductos: 0, rango: { inicio: '', fin: '' } });
                setProductosVendidos([]);
                setPaymentMethods({});
            }
            setLoading(false);
        };
        fetchKPI();
    }, [dateRange, customDates]);

    const productosVendidosChartData = {
        labels: productosVendidos.map(p => p.product),
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: productosVendidos.map(p => p.cantidad_vendida),
                backgroundColor: [
                    '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#facc15'
                ],
            },
        ],
    };

    const paymentMethodsChartData = {
        labels: Object.keys(paymentMethods),
        datasets: [
            {
                label: 'Métodos de Pago',
                data: Object.values(paymentMethods),
                backgroundColor: [
                    '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#facc15'
                ],
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Revisa el desempeño de tus ventas y el análisis
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <DateRangeFilter
                        value={dateRange}
                        onChange={setDateRange}
                        onCustomRangeChange={(start, end) => setCustomDates({ start, end })}
                    />
                    <button className="flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150">
                        <Download className="h-5 w-5 mr-1" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center">
                    <span className="text-3xl font-bold text-green-600">S/. {kpi.totalVentas.toFixed(2)}</span>
                    <span className="text-gray-500 mt-2">Ingreso Total </span>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center">
                    <span className="text-3xl font-bold text-blue-600">{kpi.totalProductos}</span>
                    <span className="text-gray-500 mt-2">Total de Productos Vendidos</span>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 flex flex-col items-center">
                    <span className="text-lg font-semibold text-gray-700">Rango</span>
                    <span className="text-gray-500 mt-1 text-sm">{kpi.rango.inicio} <br /> {kpi.rango.fin}</span>
                </div>
            </div>

            {/* Sales by category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            {chartView === 'productos' ? (
                                <BarChart3 className="h-5 w-5 text-[#4A55A2] mr-2" />
                            ) : (
                                <PieChart className="h-5 w-5 text-[#4A55A2] mr-2" />
                            )}
                            <h2 className="text-lg font-medium text-gray-900">
                                {chartView === 'productos' ? 'Productos más vendidos' : 'Métodos de Pago'}
                            </h2>
                        </div>
                        <button
                            className="px-3 py-1 rounded bg-[#4A55A2] text-white text-xs"
                            onClick={() => setChartView(chartView === 'productos' ? 'pagos' : 'productos')}
                        >
                            {chartView === 'productos' ? 'Ver Métodos de Pago' : 'Ver Productos más vendidos'}
                        </button>
                    </div>
                    <div className="w-full flex justify-center items-center min-h-[250px]">
                        {chartView === 'productos' ? (
                            productosVendidos.length > 0 ? (
                                <Bar
                                    data={productosVendidosChartData}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { beginAtZero: true } }
                                    }}
                                />
                            ) : (
                                <span className="text-gray-400">No hay datos para mostrar</span>
                            )
                        ) : (
                            Object.keys(paymentMethods).length > 0 ? (
                                <Pie
                                    data={paymentMethodsChartData}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { position: 'bottom' } }
                                    }}
                                />
                            ) : (
                                <span className="text-gray-400">No hay datos para mostrar</span>
                            )
                        )}
                    </div>
                </div>

                {/* Top selling products */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <BarChart3 className="h-5 w-5 text-[#4A55A2] mr-2" />
                            <h2 className="text-lg font-medium text-gray-900">Productos más vendidos</h2>
                        </div>
                    </div>

                    {productosVendidos.length > 0 ? (
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ingresos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {productosVendidos.length > 0 ? productosVendidos.map((prod, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 whitespace-nowrap">{prod.product}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{prod.cantidad_vendida}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">S/. {prod.total_generado.toFixed(2)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-gray-500">No hay datos de ventas disponibles</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-sm text-gray-500">No hay datos de ventas disponibles</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-[#4A55A2] mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Estado del Inventario</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Productos Totales</p>
                        <p className="text-2xl font-bold text-gray-900"></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Productos con Bajo Stock</p>
                        <p className="text-2xl font-bold text-amber-600"></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Sin Stock</p>
                        <p className="text-2xl font-bold text-red-600"></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Valor del Inventario</p>
                        <p className="text-2xl font-bold text-gray-900">

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;