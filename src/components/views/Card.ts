import { Component } from '../base/component';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected blockName: string;

  constructor(blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.blockName = blockName;

    this._title = container.querySelector(`.${blockName}__title`)!;
    this._price = container.querySelector(`.${blockName}__price`)!;
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, 'Бесценно');
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  set buttonText(value: string) {
    if (this._button) {
      this.setText(this._button, value);
    }
  }

  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }
}