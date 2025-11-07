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

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super('card', container, actions);
    this._image = container.querySelector('.card__image')!;
    this._category = container.querySelector('.card__category')!;
    this._description = container.querySelector('.card__text')!;
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
}