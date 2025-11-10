import { Component } from '../base/Component';

export class Modal extends Component<{}> {
  private closeButton: HTMLButtonElement;
  private contentContainer: HTMLElement;
  private handleEscapeBound: (event: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = container.querySelector('.modal__close')!;
    this.contentContainer = container.querySelector('.modal__content')!;
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.addEventListener('keydown', this.handleEscapeBound);
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keydown', this.handleEscapeBound);
  }

  setContent(content: HTMLElement): void {
    this.contentContainer.innerHTML = '';
    this.contentContainer.appendChild(content);
  }

  openWithContent(content: HTMLElement): void {
    this.setContent(content);
    this.open();
  }

  private handleOutsideClick(event: MouseEvent): void {
    if (event.target === this.container) {
      this.close();
    }
  }

  private handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}