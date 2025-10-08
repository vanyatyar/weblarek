import { IBuyer, TPayment } from '../../types';
export class Buyer {
    private data: Partial<IBuyer> = {};

    setPayment(payment: TPayment): void {
        this.data.payment = payment;
    }
    setEmail(email: string): void {
        this.data.email = email;
    }
    setPhone(phone: string): void {
        this.data.phone = phone;
    }
    setAddress(address: string): void {
        this.data.address = address;
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
        if (!this.data.email) errors.email = 'Укажите email';
        if (!this.data.phone) errors.phone = 'Укажите телефон';
        if (!this.data.address) errors.address = 'Укажите адрес доставки';
        return errors;
    }
}
