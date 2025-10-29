import { Card } from './Card';
import { IProduct } from '../../types';

interface ICatalogItemActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<IProduct> {
  constructor(container: HTMLElement, actions?: ICatalogItemActions) {
    super('card', container, actions);
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }
}