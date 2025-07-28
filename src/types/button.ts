export interface IButton {
  state: 'remove' | 'buy' | 'buy_disabled';
  action: (event: MouseEvent) => void;
}
