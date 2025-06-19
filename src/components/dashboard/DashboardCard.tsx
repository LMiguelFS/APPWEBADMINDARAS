import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { DashboardMetric } from '../../context/InventoryContext';

interface DashboardCardProps {
  metric: DashboardMetric;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ metric }) => {
  const { label, value, change, trend } = metric;
  
  const renderTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className="ml-2 flex items-center">
          {renderTrendIcon()}
          <span className={`text-sm ml-1 ${trendColor}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${
            trend === 'up' ? 'bg-green-500' : trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
          }`}
          style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardCard;