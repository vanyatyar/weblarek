import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

interface IBasketActions {
  onClick: () => void;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set items(value: HTMLElement[]) {
    this._list.replaceChildren(...value);
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }

  set buttonDisabled(value: boolean) {
    this.setDisabled(this._button, value);
  }
}