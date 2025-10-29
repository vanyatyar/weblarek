import { Component } from '../base/component';

export class Form<T> extends Component<T> {
  protected _errors: HTMLElement;
  protected _submit: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container);
    
    this._errors = container.querySelector('.form__errors')!;
    this._submit = container.querySelector('button[type="submit"]')!;

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  render(data: Partial<T> & { errors?: string; valid?: boolean }): HTMLElement {
    super.render(data);
    
    if (data.errors !== undefined) {
      this.errors = data.errors;
    }
    
    if (data.valid !== undefined) {
      this.valid = data.valid;
    }
    
    return this.container;
  }
}