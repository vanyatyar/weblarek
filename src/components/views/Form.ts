import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Form<T> extends Component<T> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container);

    this._submitButton = container.querySelector('button[type="submit"]')!;
    this._errors = container.querySelector('.form__errors')!;

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }
}