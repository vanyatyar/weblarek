import { IProduct } from '../../../types';

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (!this.items.find(item => item.id === product.id)) {
      this.items.push(product);
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}
