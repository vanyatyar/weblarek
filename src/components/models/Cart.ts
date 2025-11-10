import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class Cart {
  private items: IProduct[] = [];
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.eventEmitter.emit('cart:changed', { items: this.items });
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.eventEmitter.emit('cart:changed', { items: this.items });
  }

  contains(id: string): boolean {
    return this.items.some(item => item.id === id);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  clear(): void {
    this.items = [];
    this.eventEmitter.emit('cart:changed', { items: this.items });
  }
}
