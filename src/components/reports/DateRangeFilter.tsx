import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export type DateRangeType = 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

interface DateRangeFilterProps {
    value: DateRangeType;
    onChange: (range: DateRangeType) => void;
    onCustomRangeChange?: (startDate: string, endDate: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    value,
    onChange,
    onCustomRangeChange
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        if (onCustomRangeChange) onCustomRangeChange(e.target.value, endDate);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        if (onCustomRangeChange) onCustomRangeChange(startDate, e.target.value);
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-[#4A55A2] focus:border-[#4A55A2] sm:text-sm"
                    value={value}
                    onChange={(e) => onChange(e.target.value as DateRangeType)}
                >
                    <option value="day">Este día</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                    <option value="year">Este año</option>
                    <option value="all">Todo el tiempo</option>
                    <option value="custom">Personalizado</option>
                </select>
            </div>

            {value === 'custom' && (
                <div className="flex space-x-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartChange}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndChange}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;
