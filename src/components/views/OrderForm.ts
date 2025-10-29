import { Form } from './Form';
import { IBuyer } from '../../types';

export class OrderForm extends Form<IBuyer> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    this._paymentButtons = container.querySelectorAll('button[name]');
    this._addressInput = container.querySelector('input[name="address"]')!;

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('order.payment:change', {
          payment: button.name as 'card' | 'cash'
        });
      });
    });

    this._addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', {
        address: this._addressInput.value
      });
    });
  }

  set payment(value: string) {
    this._paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  render(data: Partial<IBuyer> & { errors?: string; valid?: boolean }): HTMLElement {
    super.render(data);
    
    if (data.payment) {
      this.payment = data.payment;
    }
    
    if (data.address) {
      this.address = data.address;
    }
    
    return this.container;
  }
}