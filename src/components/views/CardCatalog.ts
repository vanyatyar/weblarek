import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICatalogItemActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<IProduct> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICatalogItemActions) {
    super('card', container, actions);
    this._image = container.querySelector('.card__image')!;
    this._category = container.querySelector('.card__category')!;
  }

  set image(value: string) {
    this.setImage(this._image, `${CDN_URL}/${value}`, this.title);
  }

  set category(value: string) {
    this.setText(this._category, value);
    // Применяем класс категории для цвета фона
    this._category.className = `card__category ${categoryMap[value] || ''}`;
  }
}