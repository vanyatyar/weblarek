import { Component } from '../base/component';

export class Modal extends Component<{}> {
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = container.querySelector('.modal__close')!;
    
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.addEventListener('keydown', this.handleEscape.bind(this));
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keydown', this.handleEscape.bind(this));
  }

  setContent(content: HTMLElement): void {
    const contentContainer = this.container.querySelector('.modal__content')!;
    contentContainer.innerHTML = '';
    contentContainer.appendChild(content);
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