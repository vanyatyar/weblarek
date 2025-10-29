import { Card } from './Card';
import { IProduct } from '../../types';

interface IPreviewItemActions {
  onClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card<IProduct> {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: IPreviewItemActions) {
    super('card', container, actions);
    this._description = container.querySelector('.card__text')!;
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }
}