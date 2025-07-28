export interface IOrder {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}
