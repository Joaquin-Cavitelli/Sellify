import React, { useState, useMemo, useEffect } from 'react';
import { Sale } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SaleList } from './components/SaleList';
import { SaleFormModal } from './components/SaleFormModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Summary } from './components/Summary';
import { ChartView } from './components/ChartView';
import { Filter } from './components/Filter';
import { PlusIcon, ChartIcon, ListIcon } from './components/Icons';
import { PendingSaleList } from './components/PendingSaleList';
import { PendingSummary } from './components/PendingSummary';

type View = 'list' | 'chart';
type SalesView = 'completed' | 'pending';

const getInitialMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

function App() {
  const [sales, setSales] = useLocalStorage<Sale[]>('sales-data', []);
  const [products, setProducts] = useLocalStorage<string[]>('sales-products', []);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth);
  const [currentView, setCurrentView] = useState<View>('list');
  const [salesView, setSalesView] = useState<SalesView>('completed');

  useEffect(() => {
    const needsMigration = sales.some(s => !s.status);
    if (needsMigration) {
      setSales(sales.map(s => ({ ...s, status: s.status || 'completed' })));
    }
  }, []);

  const handleAddSale = () => {
    setSaleToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setSaleToEdit(sale);
    setIsFormModalOpen(true);
  };
  
  const handleConfirmSale = (sale: Sale) => {
    handleEditSale(sale);
  };

  const handleDeleteSale = (sale: Sale) => {
    setSaleToDelete(sale);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      setSales(sales.filter(s => s.id !== saleToDelete.id));
      setSaleToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSaveSale = (sale: Sale) => {
    if (saleToEdit) {
      setSales(sales.map(s => s.id === sale.id ? sale : s));
    } else {
      setSales([...sales, sale]);
    }
    
    setProducts(prevProducts => {
      const trimmedProduct = sale.product.trim();
      if (trimmedProduct && !prevProducts.find(p => p.toLowerCase() === trimmedProduct.toLowerCase())) {
        return [...prevProducts, trimmedProduct].sort();
      }
      return prevProducts;
    });
  };

  const completedSales = useMemo(() => sales.filter(s => s.status === 'completed'), [sales]);
  const pendingSales = useMemo(() => sales.filter(s => s.status === 'pending'), [sales]);

  const filteredCompletedSales = useMemo(() => {
    if (selectedMonth === 'all') {
      return completedSales;
    }
    return completedSales.filter(sale => sale.date.startsWith(selectedMonth));
  }, [completedSales, selectedMonth]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPendingSales = useMemo(() => {
    if (selectedMonth === 'all') {
      return pendingSales;
    }
    return pendingSales.filter(sale => sale.date.startsWith(selectedMonth));
  }, [pendingSales, selectedMonth]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800">

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {salesView === 'completed' && <Summary sales={filteredCompletedSales} />}
          {salesView === 'pending' && <PendingSummary sales={filteredPendingSales} />}

          <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200/80 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Filter sales={sales} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                  <div className="flex items-center flex-wrap justify-end gap-4">
                      {salesView === 'completed' && (
                        <div className="flex items-center bg-slate-200/70 rounded-md p-1">
                            <button 
                                onClick={() => setCurrentView('list')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${currentView === 'list' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}
                            >
                              <ListIcon className="h-5 w-5"/>
                                Lista
                            </button>
                            <button 
                                onClick={() => setCurrentView('chart')}
                                className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${currentView === 'chart' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}
                            >
                                <ChartIcon className="h-5 w-5"/>
                                Gráfico
                            </button>
                        </div>
                      )}
                      <div className="flex items-center bg-slate-200/70 rounded-md p-1">
                          <button 
                              onClick={() => setSalesView('completed')}
                              className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${salesView === 'completed' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}
                          >
                            Confirmadas
                          </button>
                          <button 
                              onClick={() => setSalesView('pending')}
                              className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${salesView === 'pending' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}
                          >
                              Pendientes
                              {pendingSales.length > 0 && (
                                <span className="bg-amber-400/80 text-amber-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{pendingSales.length}</span>
                              )}
                          </button>
                      </div>
                      
                  </div>
              </div>
          </div>
          <div className="flex justify-end mb-4">

          <button 
                    onClick={handleAddSale} 
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    >
                    <PlusIcon className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm">Registrar Venta</span>
                </button>
          
                  </div>
          {salesView === 'completed' ? (
            currentView === 'list' ? (
              <SaleList sales={filteredCompletedSales} onEdit={handleEditSale} onDelete={handleDeleteSale} />
            ) : (
              <ChartView sales={completedSales} />
            )
          ) : (
            <PendingSaleList sales={filteredPendingSales} onConfirm={handleConfirmSale} onEdit={handleEditSale} onDelete={handleDeleteSale} />
          )}

        </main>
      </div>

      <SaleFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSale}
        saleToEdit={saleToEdit}
        products={products}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este registro de venta? Esta acción no se puede deshacer."
      />
    </>
  );
}

export default App;