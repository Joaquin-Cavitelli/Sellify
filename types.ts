export interface Sale {
  id: string;
  product: string;
  amount: number;
  commissionRate: number;
  date: string; // Storing date as YYYY-MM-DD string
  status: 'completed' | 'pending';
  invoiceNumber?: string;
}