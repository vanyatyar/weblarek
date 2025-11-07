import { Card } from './Card';
import { IProduct } from '../../types';

interface IBasketItemActions {
  onClick: (event: MouseEvent) => void;
}

interface IBasketItem extends Partial<IProduct> {
  index?: number;
}

export class CardBasket extends Card<IBasketItem> {
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: IBasketItemActions) {
    super('card', container, actions);
    this._index = container.querySelector('.basket__item-index')!;
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }
}