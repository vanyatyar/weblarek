export abstract class Component<T> {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  // Установить текстовое содержимое
  setText(element: HTMLElement, value: string) {
    element.textContent = value;
  }

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean) {
    if (state) {
      element.setAttribute('disabled', 'disabled');
    } else {
      element.removeAttribute('disabled');
    }
  }

  // Установить изображение с альтернативным текстом
  setImage(element: HTMLImageElement, src: string, alt?: string) {
    element.src = src;
    if (alt) {
      element.alt = alt;
    }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
    if (data) {
      Object.assign(this as object, data);
    }
    return this.container;
  }
}