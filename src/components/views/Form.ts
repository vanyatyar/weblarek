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
        this.setDisabled(this._submitButton, !value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    protected setActive(button: HTMLButtonElement, active: boolean) {
        button.classList.toggle('button_alt-active', active);
    }

    protected setValue(input: HTMLInputElement, value: string) {
        input.value = value;
    }

    protected setText(element: HTMLElement, text: string) {
        element.textContent = text;
    }

    protected setDisabled(button: HTMLButtonElement, disabled: boolean) {
        button.disabled = disabled;
    }
}
