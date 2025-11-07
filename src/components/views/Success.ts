import { Component } from '../base/component';

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<{ total: number }> {
  protected _closeButton: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this._closeButton = container.querySelector('.order-success__close')!;
    this._description = container.querySelector('.order-success__description')!;

    if (actions?.onClick) {
      this._closeButton.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }
}