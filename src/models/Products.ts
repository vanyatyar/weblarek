import { EventEmitter } from '../components/base/events';
import { IProduct } from '../types';

export class Products {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.eventEmitter.emit('products:changed', { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.eventEmitter.emit('product:selected', { product });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
