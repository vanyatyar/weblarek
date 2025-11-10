export abstract class Component<T> {
    public container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data);
        return this.container;
    }
}