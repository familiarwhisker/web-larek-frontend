export interface IOrderData {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[]; // массив ID товаров
}
