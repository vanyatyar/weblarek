import { EventEmitter } from '../base/events';
import { IBuyer } from '../../types';

export class Buyer {
  private eventEmitter: EventEmitter;
  protected _payment: 'card' | 'cash' | null = null;
  protected _address: string = '';
  protected _email: string = '';
  protected _phone: string = '';

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  // Геттеры для доступа к данным
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

  // Метод для сохранения данных
  setPayment(payment: 'card' | 'cash'): void {
    this._payment = payment;
    this.eventEmitter.emit('buyer:changed', this.getData());
  }

  setAddress(address: string): void {
    this._address = address;
    this.eventEmitter.emit('buyer:changed', this.getData());
  }

  setEmail(email: string): void {
    this._email = email;
    this.eventEmitter.emit('buyer:changed', this.getData());
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.eventEmitter.emit('buyer:changed', this.getData());
  }

  getData(): Partial<IBuyer> {
    return {
      payment: this._payment || undefined,
      address: this._address,
      email: this._email,
      phone: this._phone
    };
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
    this.eventEmitter.emit('buyer:changed', this.getData());
  }
}