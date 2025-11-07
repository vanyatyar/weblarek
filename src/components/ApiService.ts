import { IApi, IProduct, IOrder, IOrderResponse, IApiProductList } from '../types';
import { API_URL } from '../utils/constants';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this.api.get<IApiProductList>('/product');
    return response.items;
  }

  async sendOrder(order: IOrder): Promise<IOrderResponse> {
    console.log('Sending order to server:', order);
    try {
      const result = await this.api.post<IOrderResponse>('/order', order);
      console.log('Order response from server:', result);
      return result;
    } catch (error) {
      console.error('Error sending order:', error);
      throw error;
    }
  }
}