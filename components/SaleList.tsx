
import React from 'react';
import { Sale } from '../types';
import { EditIcon, DeleteIcon } from './Icons';

interface SaleListProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-MX', options);
}

export const SaleList: React.FC<SaleListProps> = ({ sales, onEdit, onDelete }) => {
  if (sales.length === 0) {
    return (
      <div className="bg-white p-8 rounded-md shadow-sm border border-slate-200/80 text-center text-slate-500">
        <h3 className="text-lg font-semibold">No hay ventas registradas</h3>
        <p className="mt-2">¡Añade tu primera venta para empezar!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 responsive-table">
                <thead className="text-xs text-slate-600 bg-slate-50 normal-case font-semibold">
                <tr>
                    <th scope="col" className="px-6 py-4">Fecha</th>
                    <th scope="col" className="px-6 py-4">Producto</th>
                    <th scope="col" className="px-6 py-4">Nº Factura</th>
                    <th scope="col" className="px-6 py-4 text-right">Monto</th>
                    <th scope="col" className="px-6 py-4 text-right">Comisión (%)</th>
                    <th scope="col" className="px-6 py-4 text-right">Ganancia</th>
                    <th scope="col" className="px-6 py-4 text-center">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {sales.map((sale) => {
                    const commission = sale.amount * sale.commissionRate / 100;
                    return (
                        <tr key={sale.id} className="bg-white border-b border-slate-200/80 hover:bg-slate-50/70">
                        <td data-label="Fecha" className="px-6 py-5 font-medium text-slate-900 whitespace-nowrap">{formatDate(sale.date)}</td>
                        <td data-label="Producto" className="px-6 py-5">{sale.product}</td>
                        <td data-label="Nº Factura" className="px-6 py-5 text-slate-500">{sale.invoiceNumber || 'N/A'}</td>
                        <td data-label="Monto" className={`px-6 py-5 text-right ${sale.amount < 0 ? 'text-rose-600' : ''}`}>{formatCurrency(sale.amount)}</td>
                        <td data-label="Comisión (%)" className="px-6 py-5 text-right">{sale.commissionRate}%</td>
                        <td data-label="Ganancia" className={`px-6 py-5 text-right font-semibold ${commission < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatCurrency(commission)}</td>
                        <td className="px-6 py-5 actions-cell">
                            <div className="flex items-center justify-center space-x-4 md:justify-center">
                            <button onClick={() => onEdit(sale)} className="text-slate-500 hover:text-sky-600 transition-colors" title="Editar">
                                <EditIcon />
                            </button>
                            <button onClick={() => onDelete(sale)} className="text-slate-500 hover:text-rose-600 transition-colors" title="Eliminar">
                                <DeleteIcon />
                            </button>
                            </div>
                        </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    </div>
  );
};