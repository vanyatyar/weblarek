import { IApi, IProduct, IOrder, IOrderResponse } from '../types';

export class ApiService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get('/product');
        return (response as any).items as IProduct[];
    }

    async sendOrder(order: IOrder): Promise<IOrderResponse> {
        console.log('Sending order to server:', order);
        try {
            const result = await this.api.post('/order', order);
            console.log('Order response from server:', result);
            return result as IOrderResponse;
        } catch (error) {
            console.error('Error sending order:', error);
            throw error;
        }
    }
}