import { Component } from '../base/Component';

export class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Container must be an HTMLElement');
    }
    super(container);
    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
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
}