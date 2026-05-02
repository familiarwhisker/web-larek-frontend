# Web Storefront Project

This application is built using the MVP (Model–View–Presenter) architecture with TypeScript and a modern frontend stack.

## Features

- **Product Catalog** — browse products with detailed information  
- **Shopping Cart** — add/remove items, automatic total calculation  
- **Checkout Flow** — two-step form with validation:
  - Select payment method (online / cash on delivery)
  - Enter delivery address
  - Provide contact details (email, phone)
- **Form Validation** — real-time input validation  
- **Modals** — clean UI for product previews and checkout  

**Tech stack:** HTML, SCSS, TypeScript, Webpack

---

## Tech & Tools

- **TypeScript** — strict typing, modern JS  
- **SCSS (BEM)** — scalable styling architecture  
- **Webpack** — bundling and module processing  
- **HTML5** — semantic markup  
- **EventEmitter** — custom Observer implementation  
- **MVP Architecture** — clear separation of concerns  

---

## Project Structure

- `src/index.ts` — entry point, Presenter layer  
- `src/pages/index.html` — main HTML template  

### Core Layers

- `src/components/base/` — infrastructure
  - `api.ts` — API client  
  - `event-emitter.ts` — event bus  

- `src/components/models/` — data & business logic
  - `app-state.ts` — global app state (catalog, cart)  
  - `order.ts` — order model + validation  

- `src/components/views/` — UI layer
  - `main.ts`, `cart.ts`, `modal.ts`, `product-card.ts`, `success.ts`  
  - `forms/` — checkout forms  

- `src/types/` — types & interfaces  

- `src/scss/styles.scss` — global styles  
- `src/common.blocks/` — BEM blocks  
- `src/utils/` — helpers & constants  

---

## Setup

### Requirements
- Node.js ≥ 14  
- npm or yarn  

### Install
```bash
npm install
```
or
```
yarn
```

### Run (dev mode)
```bash
npm run start
```
or
```bash
yarn start
```

App runs at: `http://localhost:8080`

### Architecture Principles
- **MVP (Model-View-Presenter)** - strict separation of concerns
- **Event-Driven Architecture** 
- **Single Responsibility Principle** - every class has one responsibility
- **Dependency Inversion** - Dependency inversion via EventEmitter

## Application Logic

### Product Catalog
- Card-based UI
- Modal preview
- Add to cart
- Category-based styling

### Cart
- Add/remove items
- Auto total calculation
- Header counter
- Modal view

### Checkout
#### 1. Step 1 — Payment & Delivery
- Payment method selection
- Address input
- Real-time validation
- "Next" enabled only when valid

#### 2. Step 2 — Contacts
- Email + phone input
- Real-time validation
- "Pay" enabled only when valid

### Form Validation
- Checking required fields for completion
- Email and phone number format validation
- Displaying validation errors
- Disabling submit buttons for invalid data
- Clearing forms on reopening

### Modal Windows
- Viewing product details
- Shopping cart
- Checkout forms
- Order success message
- Closing by clicking outside the window, by clicking the cross, or by pressing Esc

## Architecture

The application is built on the MVP (Model — View — Presenter) principle:

### Model
- Manages data and business logic
- Contains form validation
- Independent of View and Presenter

### View
- Displays data to the user
- Reacts to user actions
- Sends events via EventEmitter
- Does not contain business logic

### Presenter
- Connects Model and View via events
- Coordinates interactions Between layers
- Presenter logic is implemented in `index.ts`

### Form Validation
Validation is implemented in the Model layer according to MVP principles:
- The View sends form data to the Model via events
- The Model performs validation and returns the result
- The View updates the UI based on the validation results
- Validation occurs in real time when fields change

Communication between layers is accomplished via `EventEmitter`.
Each class receives an emitter instance via the constructor and uses events to interact with other layers.

---

## MVP Event Flow
View → Presenter → Model → Presenter → View

**Detailed Example: Clicking on a Product Card**

1. **View (ProductCardView):**
- The user clicks on the product card.
- `ProductCardView` generates the `product:select` event with the product ID.

2. **Presenter (index.ts):**
- The presenter catches the `product:select`` event and calls the `appState.selectProduct(productId)` method.

3. **Model (AppState):**
- The `selectProduct` method searches for a product by id in the product list.
- If the product is found, the `product:show_preview`` event is generated with the product object.

4. **Presenter (index.ts):**
- The presenter catches the `product:show_preview`` event.
- Creates a new `ProductCardView` instance for the modal window (preview).
- Passes the card to the `ModalView` and calls `modalView.open()`.

5. **View (ModalView):**
- The modal window displays the product card.

**Scheme:**
```
ProductCardView (click)
→ emit('product:select', id)
→ [Presenter] on('product:select') → appState.selectProduct(id)
→ [AppState] emit('product:show_preview', product)
→ [Presenter] on('product:show_preview') → modalView.render(card) + modalView.open()
→ [ModalView] shows the card
```

---

## General Concept

`EventEmitter` implements the Observer pattern:
View and Model interact through events without knowing about each other directly.
All Views and Models receive an `EventEmitter` through the constructor.

---

## Entry Point, Presenter Implementation (src/index.ts)
This file is responsible for initializing the application and implementing the Presenter layer in the MVP architecture.

**Main Tasks:**
- Creates instances of all models and views
- Connects them via `EventEmitter`
- Subscribes to events and manages interactions between layers

---

## Event File Description (types/event.ts)

The `src/types/event.ts` file contains a strongly typed map of all application events. This is the central location for defining the event architecture, ensuring type safety when working with the EventEmitter.

### File Structure

**Main Interface:**
```typescript
export interface IEvent {
'*': undefined;

// Product Events
'products:loaded': undefined;
'products:loading_error': Error;
'product:add_to_cart': string; 
'product:remove_from_cart': string; 
'product:select': string; 
'product:show_preview': IProduct; 

// Cart events 
'cart:open_modal': undefined; 
'cart:render_counter': number; 
'cart:render_items': IProduct[]; 

// Order events 
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

// Events of modal windows 
'modal:close': undefined;
}
```

### Operating Principles

- **Strong Typing** - Each event has a specific payload type
- **Centralized Management** - All events are defined in one place
- **Auto-Completion** - The IDE provides hints when working with events
- **Compile-Time Errors** - Incorrect event usage is detected by TypeScript

### Usage in EventEmitter

```typescript
// Subscribing to a typed event
emitter.on('product:add_to_cart', (productId: string) => {
// productId is automatically typed as string
});

// Emitting an event
// Emit an event with type checking
emitter.emit('order:set_contacts', {
email: 'user@example.com',
phone: '+7 999 123-45-67'
});
```
---

## Observer (src/components/base/event_emitter.ts)
This file implements its own, lightweight version of the Observer pattern, which allows components to subscribe to and respond to events.
This is the fundamental communication mechanism between all parts of the application. Thanks to the EventEmitter, the View doesn't know that the Model exists, and vice versa—they simply exchange events.

**Primary Role:**
- Stores event subscriptions
- Allows subscriptions via `.on(...)`
- Allows events to be triggered via `.emit(...)`
- Ensures loose coupling between components

**Usage Example:**
```ts
emitter.on('cart:add', (product) => cartModel.addProduct(product));
emitter.emit('cart:render', cartModel.getItems());
```
---

## Model Layer

### AppStateModel
The central state model of the application, managing the product catalog, cart, and modal windows. Location: `src/components/models/app-state.ts`

**Constructor:**
```typescript
constructor(emitter: EventEmitter)
```

**Main fields:**
- `private _products: IProduct[]` — product catalog
- `private _cartItems: IProduct[]` — items in the cart
- `private _selectedProductId: string | null` — ID of the selected product
- `private _modalState: 'cart' | 'product_preview' | 'payment' | 'contacts' | 'success' | null` — modal window state
- `private api: Api` — client for working with the API
- `private emitter: EventEmitter` — event broker

**Main methods:**

**Catalog management:**
- `loadProducts(): Promise<void>` — loads products from the server
- `get products(): IProduct[]` — returns the product catalog
- `set products(value: IProduct[])` — sets the catalog and emits a load event

**Cart management:**
- `addProductToCart(productId: string): void` — adds a product to the cart (checks for duplicates)
- `removeProductFromCart(productId: string): void` — removes a product from the cart
- `get cartItems(): IProduct[]` — returns the products in the cart
- `set cartItems(value: IProduct[])` — sets the products in the cart
- `getCartItemsCount(): number` — returns Number of items in the cart
- `clearCart(): void` — Clears the cart and updates the counter
- `isProductInCart(productId: string): boolean` — Checks if a product is in the cart

**Product Selection Management:**
- `set selectedProductId(value: string)` — Sets the selected product and emits a preview event
- `get selectedProductId(): string | null` — returns the ID of the selected product

**Modal Window Management:**
- `set modalState(value)` — sets the modal window state
- `get modalState()` — returns the current state of the modal window
- `isShowingCart(): boolean` — checks if the cart is open
- `isShowingProductPreview(): boolean` — checks if the product preview is open

**Emitted Events:**
- `products:loaded` — product catalog loaded
- `products:loading_error` — catalog loading error
- `product:show_preview` — show product preview
- `cart:render_counter` — update the product counter in the cart

---

### OrderModel
Order model with form validation and order data management.
Location: `src/components/models/order.ts`

**Constructor:**
```TypeScript
constructor(emitter: EventEmitter)
```

**Main Fields:**
- `private order: Partial<IOrder>` — the current order object
- `private emitter: EventEmitter` — the event broker

**Main Methods:**

**Order Data Management:**
- `setPaymentMethod(method: 'online' | 'cash'): void` — sets the payment method
- `setAddress(address: string): void` — sets the shipping address
- `setContacts(email: string, phone: string): void` — sets contact information
- `setItems(items: IProduct[]): void` — sets the products and calculates the total

**Form Validation:**
- `validatePaymentForm(data: PaymentFormData): ValidationResult` — validate the payment form
- `validateContactsForm(data: ContactsFormData): ValidationResult` — contact form validation
- `private isValidEmail(email: string): boolean` — email format check
- `private isValidPhone(phone: string): boolean` — phone format check

**State Management:**
- `getOrder(): IOrder` — returns the full order (throws an error if the data is incomplete)
- `clear(): void` — clears the order completely
- `clearFormData(): void` — clears only the form data, leaving the products and total

**Validation Logic:**
- **Payment Form**: checks the payment method selection and the address is complete
- **Contact Form**: checks the email and phone number are complete
- **Validation Result**: contains the validity status, a list of errors, and the state of the submit button

---

## View Layer

All views are instantiated in the constructor EventEmitters generate events but don't store state or access data directly.

### MainView
Main page with a product gallery.
Location: src/components/views/main.ts

**Constructor:**
```ts
constructor(private emitter: EventEmitter)
```

**Methods:**
- `render(cards: HTMLElement[]): void` — render product cards
- `updateCounter(count: number): void` — update cart counter

**Emitted Events:**
- `'cart:open_modal'` — when the cart icon is clicked

---

## ProductCardView

### Constructor

```ts
constructor(template: HTMLTemplateElement, emitter: EventEmitter, action?: (event: MouseEvent) => void)
```
- **template** — HTML template for the card.
- **emitter** — EventEmitter instance for interacting with the presenter. - **action** — optional button click handler ("Add to Cart," "Remove from Cart," etc.), passed from the presenter (index.ts), where the cart state is available.

### Methods

- `render(product: IProduct, cardType: 'catalog' | 'preview' | 'cart' = 'catalog', buttonState?: 'remove' | 'buy' | 'buy_disabled', index?: number): HTMLElement`
Renders the product card in the desired format (catalog, preview, cart) and with the desired button state.

- `formatPrice(value: number | null): string`
Formats the price for display.

- `canBeAddedToCart(product: IProduct): boolean`
Returns true if the product can be added to the cart.

### Emitted Events

- `'product:select'` — click on the card (open preview)
- `'product:add_to_cart'` — add a product to the cart (called via the action handler)
- `'product:remove_from_cart'` — remove a product from the cart (click on the delete button in the cart)

### Features

- Does not store the "in cart" state — this attribute is defined only in the model.
- For preview cards and other variants, the button handler is passed via the constructor parameter (`action`).
- Different card templates (catalog, preview, cart) use different rendering methods, and the button state is passed via the `buttonState` parameter of the render method.
- The class does not contain business logic, only DOM and event handling.

---

### CartView
Displays the cart. Gets the predefined DOM elements of the cards.
Location: src/components/views/cart.ts

**Constructor:**
```ts
constructor(private container: HTMLElement, private emitter: EventEmitter)
```

**Methods:**
- `render(data: ICartItem[]): HTMLElement` — renders the cart
- `clear(): void` — clears the contents
- `updateTotalPrice(total: number): void` — displays the total price of the items (does not calculate, only displays the passed value)

**Emitted Events:**
- `'product:remove_from_cart'` — click on the remove item button
- `'order:open_payment_form'` — click on the "Checkout" button

---

### ModalView
A universal container for displaying modal windows.
Location: src/components/views/modal.ts

**Constructor:**
```ts
constructor(private container: HTMLElement, private emitter: EventEmitter)
```

**Methods:**
- `render(content: HTMLElement): void` — inserts content
- `open(): void` — shows the window
- `close(): void` — hides the window
- `isOpen(): boolean` — checks if the window is open

**Emitted Events:**
- `'modal:close'` — click on the background, cross, or Esc

---

### OrderPaymentView
Form: payment method and address.
Location: src/components/views/forms/order-payment.ts

**Constructor:**
```ts
constructor(template: HTMLTemplateElement, emitter: EventEmitter)
```

**Methods:**
- `render(): HTMLElement` - returns the initialized form element
- `updateValidationResult(result: ValidationResult): void` - updates the UI based on the validation results
- `bindEvents(): void` - events are bound in the constructor

**Emitted Events:**
- `'order:set_payment_method'` - select a payment method
- `'order:set_address'` - enter an address
- `'order:validate_payment_form'` - validate the payment form
- `'order:open_contacts_form'` - navigate to the contact form

**Features:**
- Initialize DOM elements in the constructor
- Real-time validation when fields change
- Automatic form clearing when reopened

---

### OrderContactsView
Form: email and phone number.
Location: `src/components/views/forms/order-contacts.ts`

**Constructor:**
```TypeScript
constructor(template: HTMLTemplateElement, emitter: EventEmitter)
```

**Methods:**
- `render(): HTMLElement` - returns the initialized form element
- `updateValidationResult(result: ValidationResult): void` - updates the UI based on the validation results
- `bindEvents(): void` - events are bound in the constructor

**Emitted Events:**
- `'order:set_contacts'` - email and phone number input
- `'order:validate_contacts_form'` - contact form validation

**Features:**
- DOM element initialization in the constructor
- Real-time validation when fields change
- Automatic form clearing on resubmission opening

---

### SuccessView
Displays the final message after a successful order.
Location: `src/components/views/success.ts`

**Methods:**
- `render(): HTMLElement` - creates and returns a DOM element with a message about a successful order

---

## Presenter Layer
All interaction between the Model and View is implemented in `index.ts`.
- Subscribing to events via `emitter.on(...)`
- Creating all class instances
- Loading data from the API and passing it to the model
- Handling user events

## Events

| Event | Source | Handler | Destination
|------------------------------|--------------------------|-----------
| `product:add_to_cart` | ProductCardView | AppState | Add product to cart
| `product:remove_from_cart` | ProductCardView/CartView| AppState | Remove product from cart
| `product:select` | ProductCardView | AppState | Select product
| `product:show_preview` | AppState | ModalView | Show product preview
| `cart:open_modal` | MainView | CartView | Open cart
| `cart:render_counter` | AppState | MainView | Update cart counter
| `cart:render_items` | (reserved) | CartView | Render cart (not used)
| `order:open_payment_form` | CartView | ModalView | Open payment form
| `order:open_contacts_form` | OrderPaymentView | ModalView | Open contact form
| `order:set_payment_method` | OrderPaymentView | OrderModel | Set payment method
| `order:set_address` | OrderPaymentView | OrderModel | Set address
| `order:set_contacts` | OrderContactsView | OrderModel | Set email and phone
| `order:validate_payment_form`| OrderPaymentView | OrderModel | Payment form validation
| `order:validate_contacts_form`| OrderContactsView | OrderModel | Contact form validation
| `order:payment_validation_result` | OrderModel | OrderPaymentView | Payment form validation result
| `order:contacts_validation_result` | OrderModel | OrderContactsView | Contact form validation result
| `order:submit_request` | OrderContactsView | index.ts, API | Submit order
| `catalog:loaded` | AppState | MainView | Catalog loaded
| `catalog:error` | AppState | MainView | Error loading catalog
| `modal:close` | ModalView | - | Close the modal window

## Data Types (src/types)
- `IProduct` — product
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

- `IOrder` — final order structure
```typescript
interface IOrder {
payment: 'online' | 'cash';
address: string;
email: string;
phone: string;
total: number;
items: string[]; // array of product IDs
}
```

- `PaymentFormData` — payment form data for validation
```typescript
interface PaymentFormData {
paymentMethod: 'online' | 'cash' | null;
address: string;
}
```

- `ContactsFormData` — contact form data for validation
```TypeScript
interface ContactsFormData {
email: string;
phone: string;
}
```

- `ValidationResult` — form validation result
```TypeScript
interface ValidationResult {
isValid: boolean;
errors: string[];
submitButtonDisabled: boolean;
}
```

- `IEvent` — map of all application events and their payload types
```TypeScript
export interface IEvent {
// ...see the current list of events above...
}
```

---

## EventEmitter
Implementation of the Observer pattern for an event-driven architecture.

**Main methods:**
- `on(eventName, handler)` — subscribe to an event (multiple handlers per event are possible)
- `off(eventName, handler)` — remove an event handler
- `emit(eventName, data?)` — trigger an event with data
- `onAll(handler)` — subscribe to all events (generic handler)
- `offAll()` — remove all handlers
- `trigger(eventName)` — get a trigger function for emitting an event

All events are strongly typed via `IEvent`.

---

## API

Class for working with the server (REST API).

**Main methods:**
- `get<T>(uri: string): Promise<T>` — GET request, returns data of type T
- `post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE')` — POST/PUT/DELETE request with data transfer

**Features:**
- The base URL is specified in the constructor
- All requests use JSON
- Server errors are handled and rethrown as exceptions
- Response types are strongly typed via generics
