import React, { useState, useEffect } from 'react';
import { Sale } from '../types';

interface SaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  saleToEdit: Sale | null;
  products: string[];
}

export const SaleFormModal: React.FC<SaleFormModalProps> = ({ isOpen, onClose, onSave, saleToEdit, products }) => {
  const [product, setProduct] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [date, setDate] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (saleToEdit) {
      setProduct(saleToEdit.product);
      setInvoiceNumber(saleToEdit.invoiceNumber || '');
      setAmount(String(saleToEdit.amount));
      setCommissionRate(String(saleToEdit.commissionRate));
      setDate(saleToEdit.date);
      setIsPending(saleToEdit.status === 'pending');
    } else {
      setProduct('');
      setInvoiceNumber('');
      setAmount('');
      setCommissionRate('1'); // Default commission to 1%
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setIsPending(false);
    }
    setError('');
  }, [saleToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedCommissionRate = parseFloat(commissionRate);

    if (!product || !amount || !commissionRate || !date) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('El monto debe ser un número positivo.');
      return;
    }
    if (isNaN(parsedCommissionRate) || parsedCommissionRate < 0 || parsedCommissionRate > 100) {
      setError('El porcentaje de comisión debe estar entre 0 y 100.');
      return;
    }

    onSave({
      id: saleToEdit ? saleToEdit.id : new Date().toISOString(),
      product: product.trim(),
      amount: parsedAmount,
      commissionRate: parsedCommissionRate,
      date,
      status: isPending ? 'pending' : 'completed',
      invoiceNumber: invoiceNumber.trim(),
    });
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">{saleToEdit ? 'Editar Venta' : 'Registrar Venta'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded-md" role="alert">{error}</div>}
          
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
            <input type="text" id="product" value={product} onChange={(e) => setProduct(e.target.value)} className="appearance-none border border-slate-300 rounded-md w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500"  list="product-suggestions" />
            <datalist id="product-suggestions">
              {products.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Nº de Factura <span className="font-normal text-slate-500">(Opcional)</span>
            </label>
            <input 
                type="text" 
                id="invoiceNumber" 
                value={invoiceNumber} 
                onChange={(e) => setInvoiceNumber(e.target.value)} 
                className="appearance-none border border-slate-300 rounded-md w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" 
                
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
              <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="appearance-none border border-slate-300 rounded-md w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500"  />
            </div>
            <div className="flex-1">
              <label htmlFor="commissionRate" className="block text-sm font-medium text-slate-700 mb-1">Comisión (%)</label>
              <input type="number" id="commissionRate" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="appearance-none border border-slate-300 rounded-md w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="10" />
            </div>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="appearance-none border border-slate-300 rounded-md w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>

          <div className="pt-2">
            <label className="flex items-center text-slate-700 select-none">
              <input 
                type="checkbox"
                checked={isPending}
                onChange={(e) => setIsPending(e.target.checked)}
                className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="ml-2 text-sm">Marcar como venta pendiente</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150 ease-in-out">
              Cancelar
            </button>
            <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150 ease-in-out">
              {saleToEdit ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};