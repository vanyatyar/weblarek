import { IBuyer } from '../../../types';

export class Buyer {
  private data: Partial<IBuyer> = {};

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.address) errors.address = 'Укажите адрес';
    if (!this.data.phone) errors.phone = 'Укажите телефон';
    if (!this.data.email) errors.email = 'Укажите email';
    return errors;
  }
}
