export interface IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
}

export interface IBuyer {
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
}

export type TPayment = 'card' | 'cash';

export interface IOrder {
  items: string[];
  total: number;
  buyer: IBuyer;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object): Promise<T>;
}