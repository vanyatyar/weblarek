import { IApi, IProduct, IOrder, IOrderResponse } from './types';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  async sendOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}