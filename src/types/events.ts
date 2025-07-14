export type AppEvents =
  | 'product:select'
  | 'cart:add'
  | 'cart:remove'
  | 'modal:open'
  | 'modal:close'
  | 'order:submit';

export interface IEvent<T = unknown> {
  type: AppEvents;
  payload?: T;
}
