import { IEvent } from '../../types/event';

// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;

export interface IEvents {
  on<K extends keyof IEvent>(event: K, callback: (data: IEvent[K]) => void): void;
  emit<K extends keyof IEvent>(event: K, data?: IEvent[K]): void;
  trigger<K extends keyof IEvent>(event: K, context?: Partial<IEvent[K]>): (data: IEvent[K]) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  /**
   * Установить обработчик на событие
   */
  on<K extends keyof IEvent>(eventName: K, callback: (event: IEvent[K]) => void) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set<Subscriber>());
    }
    this._events.get(eventName)?.add(callback);
  }

  /**
   * Снять обработчик с события
   */
  off(eventName: EventName, callback: Subscriber) {
    if (this._events.has(eventName)) {
      this._events.get(eventName)!.delete(callback);
      if (this._events.get(eventName)?.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  /**
   * Инициировать событие с данными
   */
  emit<K extends keyof IEvent>(eventName: K, data?: IEvent[K]) {
    this._events.forEach((subscribers, name) => {
      if (name === '*') {
        subscribers.forEach(callback => {
          callback({
            eventName,
            data
          });
        });
      }
      if (name instanceof RegExp && name.test(eventName) || name === eventName) {
        subscribers.forEach(callback => {
          callback(data);
        });
      }
    });
  }

  /**
   * Слушать все события
   */
  onAll<K extends keyof IEvent>(eventName: K, callback: (event: IEvent[K]) => void) {
    this.on("*", callback);
  }

  /**
   * Сбросить все обработчики
   */
  offAll() {
    this._events = new Map<string, Set<Subscriber>>();
  }

  /**
   * Сделать коллбек триггер, генерирующий событие при вызове
   */
  trigger<K extends keyof IEvent>(
    eventName: K,
    context?: Partial<IEvent[K]>
  ): (data: IEvent[K]) => void {
    return (data: IEvent[K]) => {
      this.emit(eventName, data);
    };
  }
}
