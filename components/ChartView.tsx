import React, { useMemo } from 'react';
import { Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartViewProps {
  sales: Sale[];
}

const formatCurrencyForAxis = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
}

const formatCurrencyForTooltip = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(value);
};


export const ChartView: React.FC<ChartViewProps> = ({ sales }) => {
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { month: string, comisiones: number } } = {};
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    sales.forEach(sale => {
      const saleDate = new Date(sale.date + 'T00:00:00');
      const monthIndex = saleDate.getMonth();
      const monthName = monthNames[monthIndex];
      const key = `${saleDate.getFullYear()}-${monthIndex}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = { month: monthName, comisiones: 0 };
      }
      
      monthlyData[key].comisiones += (sale.amount * sale.commissionRate / 100);
    });

    return Object.values(monthlyData).sort((a, b) => {
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });
  }, [sales]);

  if (sales.length === 0) {
    return (
      <div className="bg-white p-8 rounded-md shadow-sm border border-slate-200/80 text-center text-slate-500">
        <h3 className="text-lg font-semibold">No hay datos para mostrar en el gráfico</h3>
        <p className="mt-2">Registra algunas ventas para ver tu progreso visual.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200/80">
       <h3 className="text-lg font-semibold text-slate-800 mb-4">Comisiones Mensuales</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{fill: '#64748b'}} />
          <YAxis tickFormatter={formatCurrencyForAxis} tick={{fill: '#64748b'}}/>
          <Tooltip 
            formatter={(value: number) => [formatCurrencyForTooltip(value), 'Comisiones']}
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#1e293b' }}
          />
          <Legend />
          <Bar dataKey="comisiones" fill="#0ea5e9" name="Comisiones" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};