import { Card } from './Card';
import { IProduct } from '../../types';

interface IBasketItemActions {
  onClick: (event: MouseEvent) => void;
}

export class CardBasket extends Card<IProduct> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketItemActions) {
    super('card', container);
    this._index = container.querySelector('.basket__item-index')!;
    this._deleteButton = container.querySelector('.basket__item-delete')!;

    if (actions?.onClick) {
      this._deleteButton.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  render(data: Partial<IProduct> & { index?: number }): HTMLElement {
    super.render(data);
    if (data.index !== undefined) {
      this.index = data.index;
    }
    return this.container;
  }
}