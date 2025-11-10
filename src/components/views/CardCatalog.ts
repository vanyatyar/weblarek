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
    super(container);
    this._image = container.querySelector('.card__image')!;
    this._category = container.querySelector('.card__category')!;
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this._image, `${CDN_URL}/${value}`, this.title);
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category ${categoryMap[value] || ''}`;
  }

  render(data: IProduct): HTMLElement {
    this.title = data.title;
    this.price = data.price;
    this.image = data.image;
    this.category = data.category;
    return this.container;
  }
}