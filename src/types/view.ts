export interface IView<T = unknown> {
  render(data: T): void;
  clear?(): void;
}

export interface IModal {
  open(): void;
  close(): void;
}
