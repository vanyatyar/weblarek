import { Form } from './Form';
import { IBuyer } from '../../types';

export class ContactsForm extends Form<IBuyer> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    this._emailInput = container.querySelector('input[name="email"]')!;
    this._phoneInput = container.querySelector('input[name="phone"]')!;

    this._emailInput.addEventListener('input', () => {
      this.events.emit('contacts.email:change', {
        email: this._emailInput.value
      });
    });

    this._phoneInput.addEventListener('input', () => {
      this.events.emit('contacts.phone:change', {
        phone: this._phoneInput.value
      });
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }

  render(data: Partial<IBuyer> & { errors?: string; valid?: boolean }): HTMLElement {
    super.render(data);
    
    if (data.email) {
      this.email = data.email;
    }
    
    if (data.phone) {
      this.phone = data.phone;
    }
    
    return this.container;
  }
}