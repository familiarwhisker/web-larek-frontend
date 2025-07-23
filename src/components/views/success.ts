export class SuccessView {
  private template: HTMLTemplateElement;

  constructor() {
    this.template = document.querySelector('#success') as HTMLTemplateElement;
  }

  render(): HTMLElement {
    return this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }
}
