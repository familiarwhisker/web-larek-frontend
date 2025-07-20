# Проектная работа "Веб-ларек"

Tech stack: HTML, SCSS, TS, Webpack

## Project structure

- `src/` — source code
- `src/components/` — UI components
- `src/components/types/` — types for components and event emitter
- `src/components/base/` — event emitter and API realisation
- `src/components/models/` — models for classes and shared logic
- `src/components/view/` — view files

### Key files

- `src/pages/index.html` — main HTML page
- `src/types/index.ts` — entry point for app-wide types
- `src/index.ts` — application entry point
- `src/scss/styles.scss` — root SCSS file
- `src/utils/constants.ts` — constants
- `src/utils/utils.ts` — utility functions

## Installation and launch

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

## Architecture

The project follows the MVP (Model — View — Presenter) architectural pattern.

Model — manages data and application state.
View — handles UI rendering and user interaction.
Presenter — connects models and views, and contains business logic. Presenter logic is located in `index.ts`.

All communication between components is implemented using `EventEmitter`, which is passed into each class via constructor.
API calls are made only in `index.ts`, and their results are passed into models.

---

## Model layer

## Product model
Stores and provides access to the list of products.

**Constructor:**
```ts
constructor(emitter: EventEmitter)
```

**Fields:**
- `private products: IProduct[]` — array of products
- `private emitter: EventEmitter` — broker for emitting events

**Methods:**
- `setProducts(products: IProduct[]): void` — saves the product list
- `getProductById(id: string): IProduct | undefined` — finds product by ID
- `selectProduct(id: string): void` — emits `product:select` event

---

### `CartModel`
Manages the cart state.

**Constructor:**
```ts
constructor(emitter: EventEmitter)
```

**Fields:**
- `private items: ICartItem[]` — list of cart items
- `private emitter: EventEmitter` - event bus

**Methods:**
- `addProduct(product: IProduct): void` — adds a product or increases quantity
- `removeProduct(product: IProduct): void` — decreases quantity or removes item
- `getItems(): ICartItem[]` — returns current cart contents
- `clear(): void` — empties the cart

---

### `OrderModel`
Stores order details entered by the user.

**Constructor:**
```ts
constructor(emitter: EventEmitter)
```

**Fields:**
- `private order: Partial<IOrderData>` - temporary order storage
- `private emitter: EventEmitter` - event bus

**Methods:**
- `setPaymentMethod(method: 'card' | 'cash'): void`
- `setAddress(address: string): void`
- `setContacts(contacts: { email: string; phone: string }): void`
- `setItems(items: ICartItem[]): void`
- `getOrder(): IOrderData` - returns the final order object
- `clear(): void` - resets order data

---

## View layer

All view components receive an instance of `EventEmitter` and emit events upon user interaction.
View classes store only HTML elements — no application state is stored in view classes.

---

### `ProductCardView`
Renders product cards for each product.

**Constructor:**
```ts
constructor(container: HTMLElement, emitter: EventEmitter)
```

**Fields:**
- `private container: HTMLElement`
- `private emitter: EventEmitter` - broker for emitting events

**Methods:**
- `render(data: IProduct[]): void` - renders product list
- Emits: `product:select` on click

---

### `ModalView`
Displays modal windows.

**Constructor:**
```ts
constructor(container: HTMLElement, emitter: EventEmitter)
```

**Fields:**
- `private container: HTMLElement` - container element for rendering
- `private emitter: EventEmitter` - broker for emitting events

**Methods:**
- `open(): void` - shows modal
- `close(): void` - hides modal
- `render(product: IProduct): void` - renders product details
- Emits: `cart:add` on click inside the modal

---

### `CartView`
Displays cart contents.

**Constructor:**
```ts
constructor(container: HTMLElement, emitter: EventEmitter)
```

**Fields:**
- `private container: HTMLElement` - container element for rendering
- `private emitter: EventEmitter` - broker for emitting events

**Methods:**
- `render(data: ICartItem[]): void` - renders cart items
- `clear(): void` - clears cart view
- Emits: `cart:remove` when item is removed

---

### `OrderFormView`
Manages multi-step order form UI.

**Constructor:**
```ts
constructor(container: HTMLElement, emitter: EventEmitter)
```

**Fields:**
- `private step: number` - current form step
- `private container: HTMLElement` - container element for rendering
- `private emitter: EventEmitter` - broker for emitting events

**Methods:**
- `render(data: IOrderData): void` - placeholder render method
- `clear(): void` - resets form
- `renderStep(): void` - renders current form step
- `showError(message: string): void` - shows error message
- Emits: `order:payment` on completing the first step (selecting payment method), `order:address` on completing the second step (entering delivery address), `order:contacts` on completing the third step (providing email and phone), `order:ready` on completing the fourth step (final confirmation)

---

## Presenter
Coordinates communication between views and models via EventEmitter.

**Fields:**
- `emitter: EventEmitter` - event bus shared by all layers
- `apiClient: Api` - HTTP API client
- `productModel: ProductModel` - stores product list and handles selection
- `cartModel: CartModel` - manages cart state
- `orderModel: OrderModel` - stores order form data
- `productCardView: ProductCardView` - renders product cards
- `modalView: ModalView` - displays product details
- `cartView: CartView` - shows cart contents
- `orderFormView: OrderFormView` - handles multi-step order form

**Methods:**
- `apiClient.get('/products')` - fetches product list and passes to `productModel` and `productCardView`
- `emitter.on('product:select', ...)` - opens modal with selected product
- `emitter.on('cart:add', ...)` - adds product to cart and updates cart view
- `emitter.on('cart:remove', ...)` - removes product from cart and updates cart view
- `emitter.on('modal:close', ...)` - closes modal
- `emitter.on('order:payment', ...)` - saves payment method in `orderModel`
- `emitter.on('order:address', ...)` - saves address in `orderModel`
- `emitter.on('order:contacts', ...)` - saves contacts in `orderModel`
- `emitter.on('order:ready', ...)` - finalizes order and emits `order:submit`
- `emitter.on('order:submit', ...)` - sends order to API, clears models, and resets views

---

## Event system

### Events used in the app

| Event             | Source class       | Handled in           | Description |
|------------------|--------------------|-----------------------|-------------|
| `product:select` | `ProductCardView`  | `index.ts`            | User clicked a product |
| `cart:add`       | `ModalView`        | `CartModel`           | Product added from modal |
| `cart:remove`    | `CartView`         | `CartModel`           | Product removed from cart |
| `modal:open`     | `index.ts`         | `ModalView`           | Opens modal |
| `modal:close`    | `ModalView`        | `index.ts`            | Closes modal |
| `order:payment`  | `OrderFormView`    | `OrderModel`          | User selected payment method (`card` or `cash`) |
| `order:address`  | `OrderFormView`    | `OrderModel`          | User entered address |
| `order:contacts` | `OrderFormView`    | `OrderModel`          | User entered email and phone |
| `order:ready`    | `OrderFormView`    | `index.ts`            | All form steps completed; order can be submitted |

---

## Data types

All types are located in `src/types/` and are imported from `index.ts`.

- `IProduct` — product object: `{ id, title, description, category, image, price }`
- `ICartItem` — cart item: `{ product: IProduct, quantity: number }`
- `IOrderData` — order form data: `{ payment, address, email, phone, items }`
- `AppEventMap` — mapping of event names to payloads
- `AppEvents`, `IEvent<T>` — union of event keys and event object shape
- `IView<T>` — interface for view components with optional `clear()`

## UML diagram

![UML diagram](./web-larek-uml.drawio.png)
