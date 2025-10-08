import { IApi, IProduct, IOrder } from '../types';
export class ApiService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }
    async getProducts(): Promise<IProduct[]> {
        return this.api.get<IProduct[]>('/product/');
    }
    async sendOrder(order: IOrder): Promise<{ success: boolean }> {
        return this.api.post<{ success: boolean }>('/order/', order, 'POST');
    }
}
