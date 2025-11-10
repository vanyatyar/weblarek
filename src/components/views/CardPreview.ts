import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICardPreviewActions {
  onClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card<IProduct> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);
    this._image = container.querySelector('.card__image')!;
    this._category = container.querySelector('.card__category')!;
    this._description = container.querySelector('.card__text')!;
    
    const button = container.querySelector('.card__button');
    this._button = button ? button as HTMLButtonElement : undefined;
    
    if (this._button && actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this._image, `${CDN_URL}/${value}`, this.title);
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category ${categoryMap[value] || ''}`;
  }

  set description(value: string) {
    this.setText(this._description, value);
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

  render(data: IProduct & { buttonText?: string; buttonDisabled?: boolean }): HTMLElement {
    this.title = data.title;
    this.price = data.price;
    this.image = data.image;
    this.category = data.category;
    this.description = data.description;
    if (data.buttonText !== undefined && this._button) {
      this.buttonText = data.buttonText;
    }
    if (data.buttonDisabled !== undefined && this._button) {
      this.buttonDisabled = data.buttonDisabled;
    }
    return this.container;
  }
}