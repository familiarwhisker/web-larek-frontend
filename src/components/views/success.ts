export class SuccessView {
  private template: HTMLTemplateElement;
  private emitter: any;
  private total: number;

  constructor(emitter: any, total: number) {
    this.template = document.querySelector('#success') as HTMLTemplateElement;
    this.emitter = emitter;
    this.total = total;
  }

  render(): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const closeBtn = el.querySelector('.order-success__close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => {
      // Эмитим событие для закрытия модалки
      this.emitter.emit('modal:close');
    });
    // Подставляем сумму заказа
    const desc = el.querySelector('.order-success__description');
    if (desc) {
      desc.textContent = `Списано ${this.total} синапсов`;
    }
    return el;
  }
}
