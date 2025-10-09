import React, { useMemo } from 'react';
import { Sale } from '../types';
import { ScaleIcon, CashIcon, TrendingUpIcon } from './Icons';

interface PendingSummaryProps {
  sales: Sale[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number, colorClass: string }> = ({ icon, title, value, colorClass }) => (
    <div className="bg-white p-5 rounded-md shadow-sm border border-slate-200/80 flex items-center gap-5">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
    </div>
);

export const PendingSummary: React.FC<PendingSummaryProps> = ({ sales }) => {
  const { totalSales, totalCommission, salesCount } = useMemo(() => {
    const salesCount = sales.length;
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalCommission = sales.reduce((sum, sale) => sum + (sale.amount * sale.commissionRate / 100), 0);
    return { totalSales, totalCommission, salesCount };
  }, [sales]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
       <StatCard 
        icon={<ScaleIcon className="h-6 w-6 text-amber-600" />} 
        title="Ventas Pendientes" 
        value={salesCount}
        colorClass="bg-amber-100"
       />
       <StatCard 
        icon={<CashIcon className="h-6 w-6 text-sky-600" />} 
        title="Ventas Potenciales" 
        value={formatCurrency(totalSales)}
        colorClass="bg-sky-100"
       />
       <StatCard 
        icon={<TrendingUpIcon className="h-6 w-6 text-orange-600" />} 
        title="Comisiones Potenciales" 
        value={formatCurrency(totalCommission)}
        colorClass="bg-orange-100"
       />
    </div>
  );
};