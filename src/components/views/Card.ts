import { Component } from '../base/component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector(`.${blockName}__title`)!;
    this._price = container.querySelector(`.${blockName}__price`)!;
    this._image = container.querySelector(`.${blockName}__image`)!;
    this._category = container.querySelector(`.${blockName}__category`)!;
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, 'Бесплатно');
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  set image(value: string) {
    this.setImage(this._image, value);
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `${this.blockName}__category ${categoryMap[value] || ''}`;
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