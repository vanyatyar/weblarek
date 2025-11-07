import { Component } from '../base/component';

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

    this._list = container.querySelector('.basket__list')!;
    this._total = container.querySelector('.basket__price')!;
    this._button = container.querySelector('.basket__button')!;

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
    this._button.disabled = value;
  }
}