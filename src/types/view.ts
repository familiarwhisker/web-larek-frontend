// Basic interface for all View components
export interface IView<T = unknown> {
  render(data: T): void;
  clear?(): void;
}

// Modal interface
export interface IModal {
  open(): void;
  close(): void;
}
