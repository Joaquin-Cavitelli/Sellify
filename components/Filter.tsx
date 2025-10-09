import React, { useMemo } from 'react';
import { Sale } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface FilterProps {
  sales: Sale[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const Filter: React.FC<FilterProps> = ({ sales, selectedMonth, setSelectedMonth }) => {
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        months.add(currentMonth);

        sales.forEach(sale => {
            const month = sale.date.substring(0, 7); // YYYY-MM
            months.add(month);
        });
        return Array.from(months).sort().reverse();
    }, [sales]);

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const formatted = date.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    const currentIndex = useMemo(() => availableMonths.indexOf(selectedMonth), [availableMonths, selectedMonth]);
    
    const handlePrev = () => {
        if (currentIndex < availableMonths.length - 1) {
            setSelectedMonth(availableMonths[currentIndex + 1]);
        }
    };

    const handleNext = () => {
        if (currentIndex > 0) {
            setSelectedMonth(availableMonths[currentIndex - 1]);
        }
    };

    const isAllSelected = selectedMonth === 'all';
    const isNextDisabled = isAllSelected || currentIndex === 0;
    const isPrevDisabled = isAllSelected || currentIndex === availableMonths.length - 1;

    const getCurrentMonth = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    };

    const handleAllMonthsClick = () => {
      if (isAllSelected) {
        setSelectedMonth(getCurrentMonth());
      } else {
        setSelectedMonth('all');
      }
    };

    return (
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
            <button 
                onClick={handleAllMonthsClick}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isAllSelected ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'}`}
            >
                Todos los Meses
            </button>
            <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={isPrevDisabled} className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600">
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-center font-semibold text-slate-800 w-40">
                    {isAllSelected ? 'Filtrando todo' : formatMonth(selectedMonth)}
                </span>
                <button onClick={handleNext} disabled={isNextDisabled} className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600">
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}