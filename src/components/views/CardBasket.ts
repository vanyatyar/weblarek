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
    protected _button: HTMLButtonElement | null; 
    constructor(container: HTMLElement, actions?: IBasketItemActions) {
        super(container);
        this._index = container.querySelector('.basket__item-index')!;
        this._button = container.querySelector('.card__button'); 
        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set buttonText(value: string) {
        if (this._button) { 
            this.setText(this._button, value);
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) { 
            this.setDisabled(this._button, value);
        }
    }
}