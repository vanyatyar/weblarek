import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class Buyer {
  private events: IEvents;
  protected _payment: 'card' | 'cash' | null = null;
  protected _address: string = '';
  protected _email: string = '';
  protected _phone: string = '';

  constructor(events: IEvents) {
    this.events = events;
  }

  get payment(): 'card' | 'cash' | null {
    return this._payment;
  }

  get address(): string {
    return this._address;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  setPayment(payment: 'card' | 'cash'): void {
    this._payment = payment;
    this.events.emit('buyer:changed', this);
  }

  setAddress(address: string): void {
    this._address = address;
    this.events.emit('buyer:changed', this);
  }

  setEmail(email: string): void {
    this._email = email;
    this.events.emit('buyer:changed', this);
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.events.emit('buyer:changed', this);
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this._payment) errors.payment = 'Выберите способ оплаты';
    if (!this._address) errors.address = 'Введите адрес';
    if (!this._email) errors.email = 'Введите email';
    if (!this._phone) errors.phone = 'Введите телефон';
    return errors;
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
    this.events.emit('buyer:changed', this);
  }
}