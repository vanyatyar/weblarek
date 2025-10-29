export class Component<T> {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = value;
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
        element.setAttribute('disabled', 'true');
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