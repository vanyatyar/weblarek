import { EventEmitter } from '../components/base/events';
import { IBuyer } from '../types';

export class Buyer {
  private eventEmitter: EventEmitter;
  payment: 'card' | 'cash' | null = null;
  address: string = '';
  email: string = '';
  phone: string = '';

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  getData(): Partial<IBuyer> {
    return {
      payment: this.payment || undefined,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.address) errors.address = 'Введите адрес';
    if (!this.email) errors.email = 'Введите email';
    if (!this.phone) errors.phone = 'Введите телефон';

    return errors;
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }
}
