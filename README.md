# Проектная работа "Веб-ларек"

Tech stack: HTML, SCSS, TS, Webpack

### Ключевые файлы и папки

- `src/index.ts` — точка входа, слой Presenter (MVP)
- `src/pages/index.html` — основной HTML-шаблон
- `src/components/base/` — инфраструктурные классы (API-клиент, EventEmitter)
  - `api.ts` — API-клиент
  - `event-emitter.ts` — событийный брокер
- `src/components/models/` — слой моделей (AppState, OrderModel)
  - `app-state.ts` — состояние приложения (каталог, корзина)
  - `order-model.ts` — модель заказа
- `src/components/views/` — слой представлений (View)
  - `main.ts`, `cart.ts`, `modal.ts`, `product-card.ts`, `success.ts` — основные View-компоненты
  - `forms/` — формы заказа: `order-payment.ts`, `order-contacts.ts`, `form.ts`
- `src/types/` — типы и интерфейсы (product, cart, order, events и др.)
- `src/scss/styles.scss` — основной файл стилей
- `src/common.blocks/` — SCSS-блоки для компонентов (BEM)
- `src/utils/` — вспомогательные функции и константы
  - `constants.ts` — константы
  - `utils.ts` — утилиты

---

## Установка и запуск

To install and run the project, use:

```
npm install
npm run start
```

or

```
yarn
yarn start
```

## Build

```
npm run build
```

or

```
yarn build
```

## Архитектура

Приложение построено по принципу MVP (Model — View — Presenter):

`Model` (Модель): управляет данными и бизнес-логикой

`View` (Представление): отображает данные, реагирует на действия пользователя

`Presenter`: связывает Model и View через события. Логика презентера реализована в `index.ts`

Коммуникация между слоями осуществляется через собственный `EventEmitter`.
Каждый класс получает экземпляр emitter через конструктор и использует события для взаимодействия с другими слоями.

---

## MVP-поток событий
View → Presenter → Model → Presenter → View

**Подробный пример: клик на карточку товара**

1. **View (ProductCardView):**
   - Пользователь кликает по карточке товара.
   - `ProductCardView` генерирует событие `'product:select'` с id товара.

2. **Presenter (index.ts):**
   - Презентер ловит событие `'product:select'` и вызывает метод `appState.selectProduct(productId)`.

3. **Model (AppState):**
   - Метод `selectProduct` ищет товар по id в списке товаров.
   - Если товар найден, генерируется событие `'product:show_preview'` с объектом товара.

4. **Presenter (index.ts):**
   - Презентер ловит событие `'product:show_preview'`.
   - Создаёт новый экземпляр `ProductCardView` для модального окна (preview).
   - Передаёт карточку в `ModalView` и вызывает `modalView.open()`.

5. **View (ModalView):**
   - Модальное окно отображает карточку товара.

**Схема:**
```
ProductCardView (клик)
  → emit('product:select', id)
    → [Presenter] on('product:select') → appState.selectProduct(id)
      → [AppState] emit('product:show_preview', product)
        → [Presenter] on('product:show_preview') → modalView.render(card) + modalView.open()
          → [ModalView] показывает карточку
```

---

## Общая концепция

`EventEmitter` реализует шаблон наблюдатель (Observer):
View и Model взаимодействуют через события, не зная о друг друге напрямую.
Все View и Model получают `EventEmitter` через конструктор.

---

## Точка входа, реализация презентера (src/index.ts)
Этот файл отвечает за инициализацию приложения и реализацию слоя Presenter в архитектуре MVP.

**Основные задачи:**
- Создаёт экземпляры всех моделей и представлений
- Связывает их через `EventEmitter`
- Подписывается на события и управляет взаимодействием между слоями

---

## Описание файла событий (types/index.ts)
Этот файл содержит описания событий, которые используются в приложении для обмена данными между слоями Model, View и Presenter через `EventEmitter`. Он реализует строго типизированную событийную шину, где каждое событие связано с конкретным типом payload.

**Файл включает:**
- Карту всех событий приложения и соответствующих им типов данных (`AppEventMap`)
- Тип-объединение всех доступных событий (`AppEvents`)
- Обобщённый интерфейс события (`IEvent<T>`)

---

## Наблюдатель / Observer (src/components/base/event_emitter.ts)
Файл реализует собственный, облегчённый вариант паттерна Observer (Наблюдатель), который позволяет компонентам подписываться на события и реагировать на них.
Это фундаментальный механизм связи между всеми частями приложения. Благодаря `EventEmitter`, View не знает, что существует Model, и наоборот — они просто обмениваются событиями.

**Основная роль:**
- Хранит подписки на события
- Позволяет подписываться через `.on(...)`
- Позволяет "триггерить" события через `.emit(...)`
- Обеспечивает слабую связанность между компонентами

**Пример использования:**
```ts
emitter.on('cart:add', (product) => cartModel.addProduct(product));
emitter.emit('cart:render', cartModel.getItems());
```
---

## Слой моделей

### CartModel
Хранит список товаров в корзине и управляет логикой их добавления и удаления.
Расположение: src/components/models/app-state.ts (или cart-model.ts, если появится отдельный)

**Конструктор:**
```ts
constructor(emitter: EventEmitter)
```

**Поля:**
- `private cartItems: ICartItem[]` — список товаров в корзине
- `private emitter: EventEmitter` - брокер событий

**Методы:**
- `addProductToCart(productId: string): void` — добавляет товар по id
- `removeProductFromCart(productId: string): void` — удаляет товар по id
- `getCartItems(): ICartItem[]` — возвращает список товаров
- `clearCart(): void` — опустошает корзину

**Эмитируемые события:**
- `'cart:render_counter'` — обновить счетчик товаров в корзине

---

### OrderModel
Хранит данные текущего заказа.
Расположение: src/components/models/order-model.ts

**Конструктор:**
```ts
constructor(emitter: EventEmitter)
```

**Поля:**
- `private order: Partial<IOrderData>` - объект текущего заказа
- `private emitter: EventEmitter` - брокер событий

**Методы:**
- `setPaymentMethod(method: 'online' | 'cash'): void` - устанавливает тип оплаты
- `setAddress(address: string): void` - устанавливает строку с адресом
- `setContacts(email: string, phone: string): void` - устанавливает email и телефон
- `setItems(items: ICartItem[]): void` - массив товаров в корзине
- `getOrder(): IOrderData` - возвращает заказ или выдает ошибку, если данные неполные
- `clear(): void` - сбрасывает заказ

---

## Слой View

Все представления (View) получают в конструкторе `EventEmitter`, генерируют события, но не хранят состояние и не обращаются к данным напрямую.

### MainView
Главная страница с галереей товаров.
Расположение: src/components/views/main.ts

**Конструктор:**
```ts
constructor(private emitter: EventEmitter)
```

**Методы:**
- `render(cards: HTMLElement[]): void` — рендер карточек товаров
- `updateCounter(count: number): void` — обновление счётчика корзины

**Эмитируемые события:**
- `'cart:open_modal'` — при клике на иконку корзины

---

### ProductCardView
Создаёт DOM-элемент карточки товара.
Расположение: src/components/views/product-card.ts

**Конструктор:**
```ts
constructor(product: IProduct, template: HTMLTemplateElement, emitter: EventEmitter, inCart?: boolean)
```

**Методы:**
- `render(): HTMLElement` — возвращает карточку

**Эмитируемые события:**
- `'product:select'` — клик по карточке (открыть превью)
- `'product:add_to_cart'` — добавить товар в корзину
- `'product:remove_from_cart'` — удалить товар из корзины

---

### CartView
Отображает корзину. Получает готовые DOM-элементы карточек.
Расположение: src/components/views/cart.ts

**Конструктор:**
```ts
constructor(private container: HTMLElement, private emitter: EventEmitter)
```

**Методы:**
- `render(data: ICartItem[]): HTMLElement` — рендер корзины
- `clear(): void` — очищает содержимое

**Эмитируемые события:**
- `'product:remove_from_cart'` — клик по кнопке удаления товара
- `'order:open_payment_form'` — клик по кнопке "Оформить заказ"

---

### ModalView
Универсальный контейнер для отображения модальных окон.
Расположение: src/components/views/modal.ts

**Конструктор:**
```ts
constructor(private container: HTMLElement, private emitter: EventEmitter)
```

**Методы:**
- `render(content: HTMLElement): void` — вставляет контент
- `open(): void` — показывает окно
- `close(): void` — скрывает окно
- `isOpen(): boolean` — проверяет, открыто ли окно

**Эмитируемые события:**
- `'modal:close'` — клик по фону, крестику или Esc

---

### OrderPaymentView
Форма: способ оплаты и адрес.
Расположение: src/components/views/forms/order-payment.ts

**Методы:**
- `bindEvents()` — навешивает обработчики событий на элементы формы

**Эмитируемые события:**
- `'order:set_payment_method'` — выбор способа оплаты
- `'order:set_address'` — ввод адреса
- `'order:open_contacts_form'` — переход к форме контактов

---

### OrderContactsView
Форма: email и телефон.
Расположение: src/components/views/forms/order-contacts.ts

**Методы:**
- `bindEvents()` — навешивает обработчики событий на элементы формы

**Эмитируемые события:**
- `'order:set_contacts'` — ввод email и телефона

---

### SuccessView
Показывает финальное сообщение после успешного оформления заказа.
Расположение: src/components/views/success.ts

**Методы:**
- `render(): HTMLElement` - создаёт и возвращает DOM-элемент с сообщением об успешном оформлении заказа

---

## Слой презентера
Всё взаимодействие между Model и View реализовано в index.ts.
- Подписка на события через `emitter.on(...)`
- Создание всех экземпляров классов
- Загрузка данных с API и передача в модель
- Обработка событий пользователя

## События

| Событие                      | Источник                | Обработчик             | Назначение
|------------------------------|-------------------------|------------------------|-----------
| `product:add_to_cart`        | ProductCardView         | AppState               | Добавить товар в корзину
| `product:remove_from_cart`   | ProductCardView/CartView| AppState               | Удалить товар из корзины
| `product:select`             | ProductCardView         | AppState               | Выбрать товар
| `product:show_preview`       | AppState                | ModalView              | Показать превью товара
| `cart:open_modal`            | MainView                | CartView               | Открыть корзину
| `cart:render_counter`        | AppState                | MainView               | Обновить счетчик корзины
| `cart:render_items`          | (зарезервировано)       | CartView               | Рендер корзины (не используется)
| `order:open_payment_form`    | CartView                | ModalView              | Открыть форму оплаты
| `order:open_contacts_form`   | OrderPaymentView        | ModalView              | Открыть форму контактов
| `order:set_payment_method`   | OrderPaymentView        | OrderModel             | Установить способ оплаты
| `order:set_address`          | OrderPaymentView        | OrderModel             | Установить адрес
| `order:set_contacts`         | OrderContactsView       | OrderModel             | Установить email и телефон
| `order:submit_request`       | OrderContactsView       | index.ts, API          | Отправить заказ
| `catalog:loaded`             | AppState                | MainView               | Каталог загружен
| `catalog:error`              | AppState                | MainView               | Ошибка загрузки каталога
| `modal:close`                | ModalView               | -                      | Закрыть модальное окно


## Типы данных (src/types)

- `IProduct` — товар
```ts
interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}
```

- `ICartItem` — товар с количеством в корзине
```ts
interface ICartItem {
  product: IProduct;
  quantity: number;
}
```

- `IOrderData` — финальная структура заказа
```ts
interface IOrderData {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[]; // массив ID товаров
}
```

- `AppEventMap` — карта всех событий приложения и их типов payload (используется для строгой типизации EventEmitter и всех событий)
```ts
export interface AppEventMap {
  // ...см. актуальный список событий выше...
}
```

---

## EventEmitter
Реализация паттерна Observer для событийной архитектуры.

**Основные методы:**
- `on(eventName, handler)` — подписка на событие (можно несколько обработчиков на одно событие)
- `off(eventName, handler)` — удалить обработчик события
- `emit(eventName, data?)` — инициировать событие с данными
- `onAll(handler)` — подписка на все события (универсальный обработчик)
- `offAll()` — удалить все обработчики
- `trigger(eventName)` — получить функцию-триггер для генерации события

Все события строго типизированы через `AppEventMap`.

---

## API

Класс для работы с сервером (REST API).

**Основные методы:**
- `get<T>(uri: string): Promise<T>` — GET-запрос, возвращает данные типа T
- `post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE')` — POST/PUT/DELETE-запрос с передачей данных

**Особенности:**
- Базовый URL задаётся в конструкторе
- Все запросы используют JSON
- Ошибки сервера обрабатываются и пробрасываются как исключения
- Типы ответов строго типизированы через дженерики
