import { Form } from './Form';
import { EventEmitter } from '../base/Events';
import { IBuyer } from '../../types';

interface IContactsForm extends Partial<IBuyer> {
  valid: boolean;
  errors: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    this._emailInput = container.querySelector('input[name="email"]')!;
    this._phoneInput = container.querySelector('input[name="phone"]')!;

    this._emailInput.addEventListener('input', () => {
      this.events.emit('contacts.email:change', { email: this._emailInput.value });
    });

    this._phoneInput.addEventListener('input', () => {
      this.events.emit('contacts.phone:change', { phone: this._phoneInput.value });
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}