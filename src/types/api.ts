import { IProduct } from './product';
import { IOrderData } from './order';

export interface IApiClient {
  getProducts(): Promise<IProduct[]>;
  submitOrder(data: IOrderData): Promise<void>;
}
