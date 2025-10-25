import React, { useMemo } from 'react';
import { Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartViewProps {
  sales: Sale[];
}

const formatCurrencyForAxis = (value: number) => {
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
}

const formatCurrencyForTooltip = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(value);
};


export const ChartView: React.FC<ChartViewProps> = ({ sales }) => {
  const monthlyChartData = useMemo(() => {
    const monthlyData: { [key: string]: { month: string, comisiones: number } } = {};
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.date + 'T00:00:00');
      const year = saleDate.getFullYear();
      const monthIndex = saleDate.getMonth();
      const key = `${year}-${String(monthIndex).padStart(2, '0')}`; // YYYY-MM
      
      if (!monthlyData[key]) {
        let monthName = saleDate.toLocaleString('es-MX', { month: 'short' });
        monthName = monthName.replace('.', ''); // remove period from 'ene.'
        monthlyData[key] = { month: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} '${String(year).slice(-2)}`, comisiones: 0 };
      }
      
      monthlyData[key].comisiones += (sale.amount * sale.commissionRate / 100);
    });

    return Object.keys(monthlyData)
      .sort()
      .map(key => monthlyData[key]);
  }, [sales]);

  const productChartData = useMemo(() => {
    const productData: { [productName: string]: number } = {};
    sales.forEach(sale => {
        const productName = sale.product.trim();
        if(!productData[productName]) {
            productData[productName] = 0;
        }
        productData[productName] += (sale.amount * sale.commissionRate / 100);
    });
    return Object.entries(productData)
      .map(([product, comisiones]) => ({ product, comisiones }))
      .sort((a, b) => b.comisiones - a.comisiones);
  }, [sales]);

  if (sales.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200/80 text-center text-slate-500">
        <h3 className="text-lg font-semibold">No hay datos para mostrar en el gráfico</h3>
        <p className="mt-2">Registra algunas ventas para ver tu progreso visual.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Comisiones Mensuales</h3>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis tickFormatter={formatCurrencyForAxis} tick={{fill: '#64748b'}}/>
            <Tooltip 
                formatter={(value: number) => [formatCurrencyForTooltip(value), 'Comisiones']}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#1e293b' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            <Bar dataKey="comisiones" fill="#0ea5e9" name="Comisiones" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </div>

      {productChartData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Comisiones por Producto</h3>
            <ResponsiveContainer width="100%" height={Math.max(400, productChartData.length * 40)}>
                <BarChart 
                    data={productChartData} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={formatCurrencyForAxis} tick={{fill: '#64748b'}} />
                    <YAxis 
                        type="category" 
                        dataKey="product" 
                        width={150} 
                        tick={{fill: '#475569', fontSize: 12}}
                        interval={0}
                    />
                    <Tooltip 
                        formatter={(value: number) => [formatCurrencyForTooltip(value), 'Comisiones']}
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                        labelStyle={{ color: '#1e293b' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="comisiones" fill="#10b981" name="Comisiones" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
