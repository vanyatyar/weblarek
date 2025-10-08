import { IProduct } from '../../types';
export class Products {
    private items: IProduct[] = [];
    private selected: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }
    getItemById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }
    setSelected(item: IProduct): void {
        this.selected = item;
    }
    getSelected(): IProduct | null {
        return this.selected;
    }
}
