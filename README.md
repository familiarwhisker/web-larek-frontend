# Проектная работа "Веб-ларек"

Tech stack: HTML, SCSS, TS, Webpack

## Структура проекта

src/
├── components/
│   ├── base/                 — инфраструктурные классы (API, EventEmitter)
│   ├── models/               — слой Модели (данные и логика)
│   ├── views/                — слой Представления (отрисовка)
│   │   ├── forms/            — формы оформления заказа
│   └── ...                   — другие view-компоненты
├── types/                    — типы и интерфейсы
├── pages/index.html          — основной HTML-шаблон
├── scss/                     — стили
└── index.ts                  — точка входа, слой Презентера

### Ключевые файлы

- `src/pages/index.html` — HTML-шаблон страницы
- `src/types/index.ts` — корневой файл типов
- `src/index.ts` — точка входа, презентер
- `src/scss/styles.scss` — корневой файл стилей
- `src/components/base/api.ts` - API-клиент
- `src/components/base/event_emitter.ts` - реализация паттерна «Наблюдатель»
- `src/components/models/` - классы модели
- `src/components/views/` - классы представлений
- `src/utils/constants.ts` — константы
- `src/utils/utils.ts` — вспомогательные функции

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

Пример:
Клик на карточку → product:select
ProductModel вызывает preview:change
ModalView открывает карточку

---

## Общая концепция

`EventEmitter` реализует шаблон наблюдатель (Observer):
View и Model взаимодействуют через события, не зная о друг друге напрямую.
Все View и Model получают `EventEmitter` через конструктор.

---

## Особенности
- Событийная архитектура
- Строгая типизация
- Разделение ответственности
- Легко масштабируется
- Все данные и UI связаны только через `EventEmitter`

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

**Структура:**
```ts
interface IEvents {
  on<K extends keyof AppEventMap>(
    event: K,
    callback: (payload: AppEventMap[K]) => void
  ): void;

  emit<K extends keyof AppEventMap>(
    event: K,
    payload?: AppEventMap[K]
  ): void;
}
```

---

## Слой моделей

## Типы данных (src/types)

### `ProductModel`
Управляет данными о товарах. Служит хранилищем товаров, полученных с сервера, и предоставляет методы получения и выбора товара.
Расположение: src/components/models/product-model.ts

**Конструктор:**
```ts
constructor(private emitter: EventEmitter)
```

**Поля:**
- `private products: IProduct[]` — список всех товаров
- `private emitter: EventEmitter` — экземпляр брокера событий

**Методы:**
- `setProducts(products: IProduct[])` — выводит список товаров
- `getProductById(id: string): IProduct | undefined` — ищет товар по id
- `selectProduct(id: string): void` — эмитирует событие `product:select` с выбранным товаром

---

### `CartModel`
Хранит список товаров в корзине и управляет логикой их добавления и удаления.
Расположение: src/components/models/cart-model.ts

**Конструктор:**
```ts
constructor(emitter: EventEmitter)
```

**Поля:**
- `private items: ICartItem[]` — список товаров в корзине
- `private emitter: EventEmitter` - брокер событий

**Методы:**
- `addProduct(product: IProduct): void` — добавляет товар или увеличивает количество
- `removeProduct(product: IProduct): void` — удаляет товар или уменьшает количество
- `getItems(): ICartItem[]` — возвращает список товаров
- `clear(): void` — опустошает корзину

---

### `OrderModel`
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
- `setPaymentMethod(method: 'card' | 'cash'): void` - устанавливает тип оплаты
- `setAddress(address: string): void` - устанавливает строку с адресом
- `setContacts(contacts: { email: string; phone: string }): void` устанавливает строки email и номер телефона
- `setItems(items: ICartItem[]): void` - массив товаров в корзине
- `getOrder(): IOrderData` - возвращает заказ или выдает ошибку, если данные неполные
- `clear(): void` - сбрасывает заказ

---

## Слой View

Общая концепция
Все представления (View) получают в конструкторе `EventEmitter`, генерируют события, но не хранят состояние и не обращаются к данным напрямую.

---
### `MainView`
Главная страница с галереей товаров.
Расположение: src/components/views/main.ts

**Конструктор:**
```ts
constructor(private emitter: EventEmitter)
```

**Поля:**
- `gallery: HTMLElement` - контейнер для карточек
- `basketButton: HTMLButtonElement` - кнопка корзины
- `counter: HTMLElement` - счётчик товаров

**Методы:**
- `render(cards: HTMLElement[]): void` -  рендер карточек
- `updateCounter(count: number): void` - обновление счётчика

**Эмитируемые события:**
- `'cart:open'` - при клике на корзину

---

### `ProductCardView`
Создаёт DOM-элемент карточки товара.
Расположение: src/components/views/product-card.ts

**Конструктор:**
```ts
constructor(product: IProduct, template: HTMLTemplateElement, emitter: EventEmitter)
```

**Методы:**
- `render(): HTMLElement` - возвращает карточку

**Эмитируемые события:**
- `'product:select'` - при клике на карточку
- `'cart:add'` - при добавлении в корзину
- `'cart:remove'` - при удалении из корзины

---

### `CartView`
Отображает корзину. Получает готовые DOM-элементы карточек.
Расположение: src/components/views/cart.ts

**Конструктор:**
```ts
constructor(private container: HTMLElement, private emitter: EventEmitter)
```

**Методы:**
- `render(data: ICartItem[]): void` - рендер корзины
- `clear(): void` - очищает содержимое

**Эмитируемые события:**
- `'cart:remove'` - при клике на кнопку удаления
- `'order:open'` - при оформлении заказа

---

### `ModalView`
Универсальный контейнер для отображения модальных окон.
Расположение: src/components/views/modal.ts

**Конструктор:**
```ts
constructor(private container: HTMLElement, private emitter: EventEmitter)
```

**Методы:**
- `render(content: HTMLElement): void` - вставляет контент
- `open(): void` - показывает окно
- `close(): void` - скрывает окно

**Обрабатывает события:**
- `'modal:close'` - клик по фону и крестику закрывает окно

---

### `FormView`
Абстрактный класс. Родительский класс для форм заказа.
Расположение: src/components/views/forms/form.ts

**Методы:**
- `render(data?: T): HTMLElement` - рендерит HTML-разметку формы с подставленными значениями из data (если есть). Возвращает DOM-элемент формы
- `clear(): void` - очищает все поля формы (инпуты, сообщения об ошибке)
- `showError(message: string): void` - отображает сообщение об ошибке в рамках формы, например при некорректной валидации
- `abstract bindEvents(data?: T): void` - абстрактный метод. Дочерние классы должны реализовать навешивание обработчиков событий на элементы формы (submit, change и др.)

---

### `OrderPaymentView`
Форма: способ оплаты и адрес.
Расположение: src/components/views/forms/order-payment.ts

**Методы:**
- `bindEvents()` - валидация и отправка

**Эмитируемые события:**
- `'order:payment'` - эмитируется при выборе способа оплаты (card или cash), передаёт значение как строку
- `'order:address'` - эмитируется при вводе адреса, передаёт строку
- `'order:ready'` - эмитируется после успешной валидации всей формы, сигнализируя, что можно переходить к следующему шагу (форма контактов)

---

### `OrderContactsView`
Форма: email и телефон.
Расположение: src/components/views/forms/order-contacts.ts

**Методы:**
- `bindEvents()` - валидация и отправка

**Эмитируемые события:**
- `'order:contacts'` - эмитируется после успешного ввода email и телефона, передаёт `объект { email, phone }`
- `'order:submit'` - эмитируется при отправке формы, инициирует финальную отправку данных на сервер

---

### `SuccessView`
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

| Событие         | Источник          | Обработчик             | Назначение
|-----------------|-------------------|------------------------|-----------
|                 |                   |                        |
| `product:select`| `ProductCardView` | `ProductModel`         | Выбор товара
|                 |                   |                        |
| `preview:change`| `ProductModel`    | `ModalView`            | Отображение
|                 |                   |                        | товара в
|                 |                   |                        | модалке
|                 |                   |                        |
| `cart:add`      | `ProductCardView` | `CartModel`            | Добавление в
|                 |                   |                        | корзину
|                 |                   |                        |
| `cart:remove`   | `ProductCardView` | `CartModel`            | Удаление из
|                 |                   |                        | корзины
|                 |                   |                        |
| `cart:render`   | `CartModel`       | `CartView`, `MainView` | Рендер
|                 |                   |                        | корзины и
|                 |                   |                        | обновление
|                 |                   |                        | счётчика
|                 |                   |                        |
| `cart:open`     | `MainView`        | `CartView`             | Открытие
|                 |                   |                        | модального
|                 |                   |                        | окна с
|                 |                   |                        | корзиной
|                 |                   |                        |
| `modal:close`   | `ModalView`       | -                      | Закрытие
|                 |                   |                        | модального
|                 |                   |                        | окна
|                 |                   |                        |
| `order:open`    | `CartView`        | `ModalView`            | Открыть
|                 |                   |                        | форму
|                 |                   |                        | оплаты
|                 |                   |                        |
| `order:payment` | `OrderPaymentView`| `OrderModel`           | Установка
|                 |                   |                        | способа
|                 |                   |                        | оплаты
|                 |                   |                        |
| `order:address` | `OrderPaymentView`| `OrderModel`           | Установка
|                 |                   |                        | адреса
|                 |                   |                        |
| `order:ready`   | `OrderPaymentView`| `ModalView`            | Открыть
|                 |                   |                        | форму
|                 |                   |                        | контактов
|                 |                   |                        |
| `order:contacts`|`OrderContactsView`| `OrderModel`           | Установка
|                 |                   |                        | email и
|                 |                   |                        | телефона
|                 |                   |                        |
| `order:submit`  |`OrderContactsView`| `index.ts`, `API`      | отправка
|                 |                   |                        | заказа,
|                 |                   |                        | показ
|                 |                   |                        | `SuccessView`
|-----------------|-------------------|------------------------|-----------


## Типы данных (src/types)

- `IProduct` - товар
```ts
interface IProduct {
  id: string;            // уникальный идентификатор товара
  title: string;         // название
  description: string;   // описание
  category: string;      // категория (например, "софт", "другое")
  image: string;         // URL изображения
  price: number;         // цена
}
```

- `ICartItem` - товар с количеством в корзине
```ts
interface ICartItem {
  product: IProduct;     // сам товар
  quantity: number;      // количество в корзине
}
```

- `IOrderContacts` - контакты пользователя
```ts
interface IOrderContacts {
  email: string;         // адрес электронной почты
  phone: string;         // номер телефона
}
```

- `IOrderPayment` - способ оплаты
```ts
interface IOrderPayment {
  payment: 'card' | 'cash'; // способ оплаты
  address: string;          // адрес доставки
}
```

- `IOrderData` - финальная структура заказа
```ts
interface IOrderData {
  payment: 'card' | 'cash'; // способ оплаты
  address: string;          // адрес
  email: string;            // email клиента
  phone: string;            // номер телефона клиента
  items: ICartItem[];       // список товаров с количеством
}
```

---

## Event emitter
Реализация паттерна Observer.

**Методы:**
- `on(eventName, handler)` - регистрирует обработчик `handler` на событие `eventName`. Можно регистрировать несколько обработчиков на одно событие.
- `off(eventName, handler)` - удаляет обработчик `handler` для события `eventName`.
- `emit(eventName, data?)` - вызывает все обработчики, зарегистрированные на событие `eventName`, передаёт им объект `data`.

---

## API

**Методы:**
- `getProducts(): Promise<IProduct[]>` - выполняет GET-запрос к серверу и возвращает список товаров в формате `IProduct[]`
- `order(data: IOrderData): Promise<void>` - отправляет POST-запрос с финальными данными заказа на сервер. Возвращает `Promise<void>`; при успешной отправке открывается окно `SuccessView`.
