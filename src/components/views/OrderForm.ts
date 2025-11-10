import { Form } from './Form';
import { EventEmitter } from '../base/Events';
import { IBuyer } from '../../types';

interface IOrderForm extends Partial<IBuyer> {
  valid: boolean;
  errors: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
    this._addressInput = container.querySelector('input[name="address"]')!;

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const payment = button.name as 'card' | 'cash';
        this.events.emit('order.payment:change', { payment });
      });
    });

    this._addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', { address: this._addressInput.value });
    });
  }

  set payment(value: 'card' | 'cash' | undefined) {
    this._paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}