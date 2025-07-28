# Проектная работа "Веб-ларек"

Приложение построено на принципах MVP (Model-View-Presenter) архитектуры с использованием TypeScript и современного стека технологий.

## Основные возможности

- **Каталог товаров** - просмотр товаров с детальной информацией
- **Корзина покупок** - добавление/удаление товаров, подсчет общей стоимости
- **Оформление заказа** - двухэтапная форма с валидацией:
  - Выбор способа оплаты (онлайн/при получении)
  - Ввод адреса доставки
  - Ввод контактных данных (email, телефон)
- **Валидация форм** - проверка корректности введенных данных в реальном времени
- **Модальные окна** - удобный интерфейс для просмотра товаров и оформления заказов

Tech stack: HTML, SCSS, TypeScript, Webpack

## Технологии и инструменты

- **TypeScript** - строгая типизация, современный JavaScript
- **SCSS** - препроцессор CSS с использованием BEM методологии
- **Webpack** - сборка проекта, обработка модулей
- **HTML5** - семантическая разметка
- **EventEmitter** - собственная реализация паттерна Observer для событийной архитектуры
- **MVP архитектура** - четкое разделение ответственности между слоями

### Ключевые файлы и папки

- `src/index.ts` — точка входа, слой Presenter (MVP)
- `src/pages/index.html` — основной HTML-шаблон
- `src/components/base/` — инфраструктурные классы (API-клиент, EventEmitter)
  - `api.ts` — API-клиент
  - `event-emitter.ts` — событийный брокер
- `src/components/models/` — слой моделей (AppState, OrderModel)
  - `app-state.ts` — состояние приложения (каталог, корзина)
  - `order.ts` — модель заказа с валидацией форм
- `src/components/views/` — слой представлений (View)
  - `main.ts`, `cart.ts`, `modal.ts`, `product-card.ts`, `success.ts` — основные View-компоненты
  - `forms/` — формы заказа: `order-payment.ts`, `order-contacts.ts`, `form.ts`
- `src/types/` — типы и интерфейсы
  - `product.ts` — типы товаров
  - `order.ts` — типы заказов
  - `event.ts` — типы событий
  - `validation.ts` — типы валидации форм
- `src/scss/styles.scss` — основной файл стилей
- `src/common.blocks/` — SCSS-блоки для компонентов (BEM)
- `src/utils/` — вспомогательные функции и константы
  - `constants.ts` — константы
  - `utils.ts` — утилиты

---

## Установка и запуск

### Предварительные требования
- Node.js (версия 14 или выше)
- npm или yarn

### Установка зависимостей
```bash
npm install
```
или
```bash
yarn
```

### Запуск в режиме разработки
```bash
npm run start
```
или
```bash
yarn start
```

Приложение будет доступно по адресу: `http://localhost:8080`

## Принципы разработки

### Архитектурные принципы
- **MVP (Model-View-Presenter)** - четкое разделение ответственности
- **Event-Driven Architecture** - взаимодействие через события
- **Single Responsibility Principle** - каждый класс имеет одну ответственность
- **Dependency Inversion** - зависимости инвертированы через EventEmitter

## Функциональность приложения

### Каталог товаров
- Отображение товаров в виде карточек
- Просмотр детальной информации о товаре в модальном окне
- Добавление товаров в корзину
- Категоризация товаров с визуальным оформлением

### Корзина покупок
- Добавление/удаление товаров
- Автоматический подсчет общей стоимости
- Счетчик товаров в шапке сайта
- Просмотр содержимого корзины в модальном окне

### Оформление заказа
Процесс оформления заказа состоит из двух этапов:

#### 1. Форма оплаты и доставки
- Выбор способа оплаты (онлайн/при получении)
- Ввод адреса доставки
- Валидация в реальном времени
- Кнопка "Далее" активируется только при корректном заполнении

#### 2. Форма контактов
- Ввод email адреса
- Ввод номера телефона
- Валидация в реальном времени
- Кнопка "Оплатить" активируется только при корректном заполнении

### Валидация форм
- Проверка заполненности обязательных полей
- Валидация формата email и телефона
- Отображение ошибок валидации
- Блокировка кнопок отправки при некорректных данных
- Очистка форм при повторном открытии

### Модальные окна
- Просмотр детальной информации о товаре
- Корзина покупок
- Формы оформления заказа
- Сообщение об успешном заказе
- Закрытие по клику вне окна, по крестику или клавише Esc

## Архитектура

Приложение построено по принципу MVP (Model — View — Presenter):

### Model (Модель)
- Управляет данными и бизнес-логикой
- Содержит валидацию форм
- Не зависит от View и Presenter

### View (Представление)
- Отображает данные пользователю
- Реагирует на действия пользователя
- Отправляет события через EventEmitter
- Не содержит бизнес-логику

### Presenter
- Связывает Model и View через события
- Координирует взаимодействие между слоями
- Логика презентера реализована в `index.ts`

### Валидация форм
Валидация реализована в слое Model согласно принципам MVP:
- View отправляет данные формы в Model через события
- Model выполняет валидацию и возвращает результат
- View обновляет UI на основе результатов валидации
- Валидация происходит в реальном времени при изменении полей

Коммуникация между слоями осуществляется через `EventEmitter`.
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

## Описание файла событий (types/event.ts)

Файл `src/types/event.ts` содержит строго типизированную карту всех событий приложения. Это центральное место для определения событийной архитектуры, обеспечивающее типобезопасность при работе с EventEmitter.

### Структура файла

**Основной интерфейс:**
```typescript
export interface IEvent {
  '*': undefined;

  // События продуктов
  'products:loaded': undefined;
  'products:loading_error': Error;
  'product:add_to_cart': string;
  'product:remove_from_cart': string;
  'product:select': string;
  'product:show_preview': IProduct;

  // События корзины
  'cart:open_modal': undefined;
  'cart:render_counter': number;
  'cart:render_items': IProduct[];

  // События заказа
  'order:open_contacts_form': undefined;
  'order:open_payment_form': undefined;
  'order:set_address': { value: string };
  'order:set_contacts': { email: string; phone: string };
  'order:set_payment_method': { method: 'online' | 'cash' };
  'order:submit_request': IOrder;
  'order:validate_payment_form': PaymentFormData;
  'order:validate_contacts_form': ContactsFormData;
  'order:payment_validation_result': ValidationResult;
  'order:contacts_validation_result': ValidationResult;

  // События модальных окон
  'modal:close': undefined;
}
```

### Принципы работы

- **Строгая типизация** - каждое событие имеет определенный тип payload
- **Централизованное управление** - все события определены в одном месте
- **Автодополнение** - IDE предоставляет подсказки при работе с событиями
- **Ошибки на этапе компиляции** - неправильное использование событий выявляется TypeScript

### Использование в EventEmitter

```typescript
// Подписка на событие с типизацией
emitter.on('product:add_to_cart', (productId: string) => {
  // productId автоматически типизирован как string
});

// Эмиссия события с проверкой типов
emitter.emit('order:set_contacts', {
  email: 'user@example.com',
  phone: '+7 999 123-45-67'
});
```
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

### AppStateModel
Центральная модель состояния приложения, управляющая каталогом товаров, корзиной и модальными окнами.
Расположение: `src/components/models/app-state.ts`

**Конструктор:**
```typescript
constructor(emitter: EventEmitter)
```

**Основные поля:**
- `private _products: IProduct[]` — каталог товаров
- `private _cartItems: IProduct[]` — товары в корзине
- `private _selectedProductId: string | null` — ID выбранного товара
- `private _modalState: 'cart' | 'product_preview' | 'payment' | 'contacts' | 'success' | null` — состояние модального окна
- `private api: Api` — клиент для работы с API
- `private emitter: EventEmitter` — брокер событий

**Основные методы:**

**Управление каталогом:**
- `loadProducts(): Promise<void>` — загружает товары с сервера
- `get products(): IProduct[]` — возвращает каталог товаров
- `set products(value: IProduct[])` — устанавливает каталог и эмитит событие загрузки

**Управление корзиной:**
- `addProductToCart(productId: string): void` — добавляет товар в корзину (проверяет дубликаты)
- `removeProductFromCart(productId: string): void` — удаляет товар из корзины
- `get cartItems(): IProduct[]` — возвращает товары в корзине
- `set cartItems(value: IProduct[])` — устанавливает товары в корзине
- `getCartItemsCount(): number` — возвращает количество товаров в корзине
- `clearCart(): void` — очищает корзину и обновляет счетчик
- `isProductInCart(productId: string): boolean` — проверяет наличие товара в корзине

**Управление выбором товара:**
- `set selectedProductId(value: string)` — устанавливает выбранный товар и эмитит событие показа превью
- `get selectedProductId(): string | null` — возвращает ID выбранного товара

**Управление модальными окнами:**
- `set modalState(value)` — устанавливает состояние модального окна
- `get modalState()` — возвращает текущее состояние модального окна
- `isShowingCart(): boolean` — проверяет, открыта ли корзина
- `isShowingProductPreview(): boolean` — проверяет, открыто ли превью товара

**Эмитируемые события:**
- `'products:loaded'` — каталог товаров загружен
- `'products:loading_error'` — ошибка загрузки каталога
- `'product:show_preview'` — показать превью товара
- `'cart:render_counter'` — обновить счетчик товаров в корзине

---

### OrderModel
Модель заказа с валидацией форм и управлением данными заказа.
Расположение: `src/components/models/order.ts`

**Конструктор:**
```typescript
constructor(emitter: EventEmitter)
```

**Основные поля:**
- `private order: Partial<IOrder>` — объект текущего заказа
- `private emitter: EventEmitter` — брокер событий

**Основные методы:**

**Управление данными заказа:**
- `setPaymentMethod(method: 'online' | 'cash'): void` — устанавливает способ оплаты
- `setAddress(address: string): void` — устанавливает адрес доставки
- `setContacts(email: string, phone: string): void` — устанавливает контактные данные
- `setItems(items: IProduct[]): void` — устанавливает товары и рассчитывает общую сумму

**Валидация форм:**
- `validatePaymentForm(data: PaymentFormData): ValidationResult` — валидация формы оплаты
- `validateContactsForm(data: ContactsFormData): ValidationResult` — валидация формы контактов
- `private isValidEmail(email: string): boolean` — проверка формата email
- `private isValidPhone(phone: string): boolean` — проверка формата телефона

**Управление состоянием:**
- `getOrder(): IOrder` — возвращает полный заказ (выбрасывает ошибку при неполных данных)
- `clear(): void` — полностью очищает заказ
- `clearFormData(): void` — очищает только данные форм, оставляя товары и сумму

**Логика валидации:**
- **Форма оплаты**: проверка выбора способа оплаты и заполненности адреса
- **Форма контактов**: проверка заполненности email и телефона
- **Результат валидации**: содержит статус валидности, список ошибок и состояние кнопки отправки

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

## ProductCardView

### Конструктор

```ts
constructor(template: HTMLTemplateElement, emitter: EventEmitter, action?: (event: MouseEvent) => void)
```
- **template** — HTML-шаблон карточки.
- **emitter** — экземпляр EventEmitter для взаимодействия с presenter.
- **action** — необязательный обработчик клика по кнопке ("В корзину", "Удалить из корзины" и т.д.), передаётся из presenter (index.ts), где доступно состояние корзины.

### Методы

- `render(product: IProduct, cardType: 'catalog' | 'preview' | 'cart' = 'catalog', buttonState?: 'remove' | 'buy' | 'buy_disabled', index?: number): HTMLElement`
  Рендерит карточку товара в нужном виде (каталог, превью, корзина) и с нужным состоянием кнопки.

- `formatPrice(value: number | null): string`
  Форматирует цену для отображения.

- `canBeAddedToCart(product: IProduct): boolean`
  Возвращает true, если товар можно добавить в корзину.

### Эмитируемые события

- `'product:select'` — клик по карточке (открыть превью)
- `'product:add_to_cart'` — добавить товар в корзину (вызывается через обработчик action)
- `'product:remove_from_cart'` — удалить товар из корзины (клик по кнопке удаления в корзине)

### Особенности

- Не хранит состояние "в корзине" — этот признак определяется только в модели.
- Для карточки-превью и других вариантов обработчик кнопки передаётся через параметр конструктора (`action`).
- Для разных шаблонов карточки (каталог, превью, корзина) используются разные методы рендера, а состояние кнопки передаётся через параметр `buttonState` метода render.
- Класс не содержит бизнес-логики, только работу с DOM и событиями.

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
- `updateTotalPrice(total: number): void` — отображает общую стоимость товаров (не рассчитывает, только показывает переданное значение)

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

**Конструктор:**
```ts
constructor(template: HTMLTemplateElement, emitter: EventEmitter)
```

**Методы:**
- `render(): HTMLElement` - возвращает инициализированный элемент формы
- `updateValidationResult(result: ValidationResult): void` - обновляет UI на основе результатов валидации
- `bindEvents(): void` - события привязаны в конструкторе

**Эмитируемые события:**
- `'order:set_payment_method'` - выбор способа оплаты
- `'order:set_address'` - ввод адреса
- `'order:validate_payment_form'` - валидация формы оплаты
- `'order:open_contacts_form'` - переход к форме контактов

**Особенности:**
- Инициализация DOM элементов в конструкторе
- Валидация в реальном времени при изменении полей
- Автоматическая очистка формы при повторном открытии

---

### OrderContactsView
Форма: email и телефон.
Расположение: `src/components/views/forms/order-contacts.ts`

**Конструктор:**
```typescript
constructor(template: HTMLTemplateElement, emitter: EventEmitter)
```

**Методы:**
- `render(): HTMLElement` - возвращает инициализированный элемент формы
- `updateValidationResult(result: ValidationResult): void` - обновляет UI на основе результатов валидации
- `bindEvents(): void` - события привязаны в конструкторе

**Эмитируемые события:**
- `'order:set_contacts'` - ввод email и телефона
- `'order:validate_contacts_form'` - валидация формы контактов

**Особенности:**
- Инициализация DOM элементов в конструкторе
- Валидация в реальном времени при изменении полей
- Автоматическая очистка формы при повторном открытии

---

### SuccessView
Показывает финальное сообщение после успешного оформления заказа.
Расположение: `src/components/views/success.ts`

**Методы:**
- `render(): HTMLElement` - создаёт и возвращает DOM-элемент с сообщением об успешном оформлении заказа

---

## Слой презентера
Всё взаимодействие между Model и View реализовано в `index.ts`.
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
| `order:validate_payment_form`| OrderPaymentView        | OrderModel             | Валидация формы оплаты
| `order:validate_contacts_form`| OrderContactsView       | OrderModel             | Валидация формы контактов
| `order:payment_validation_result` | OrderModel         | OrderPaymentView       | Результат валидации формы оплаты
| `order:contacts_validation_result` | OrderModel       | OrderContactsView      | Результат валидации формы контактов
| `order:submit_request`       | OrderContactsView       | index.ts, API          | Отправить заказ
| `catalog:loaded`             | AppState                | MainView               | Каталог загружен
| `catalog:error`              | AppState                | MainView               | Ошибка загрузки каталога
| `modal:close`                | ModalView               | -                      | Закрыть модальное окно

## Типы данных (src/types)

- `IProduct` — товар
```typescript
interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
}
```

- `IOrder` — финальная структура заказа
```typescript
interface IOrder {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[]; // массив ID товаров
}
```

- `PaymentFormData` — данные формы оплаты для валидации
```typescript
interface PaymentFormData {
  paymentMethod: 'online' | 'cash' | null;
  address: string;
}
```

- `ContactsFormData` — данные формы контактов для валидации
```typescript
interface ContactsFormData {
  email: string;
  phone: string;
}
```

- `ValidationResult` — результат валидации формы
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  submitButtonDisabled: boolean;
}
```

- `IEvent` — карта всех событий приложения и их типов payload
```typescript
export interface IEvent {
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

Все события строго типизированы через `IEvent`.

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
