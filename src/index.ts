import './scss/styles.scss';

import Api from './components/base/api';
import { EventEmitter } from './components/base/event-emitter';
import { API_URL } from './utils/constants';

import { ProductCardView } from './components/views/product-card';
import { ModalView } from './components/views/modal';
import { CartView } from './components/views/cart';
import { MainView } from './components/views/main';
import { OrderPaymentView } from './components/views/forms/order-payment';
import { OrderContactsView } from './components/views/forms/order-contacts';
import { SuccessView } from './components/views/success';
import { AppState } from './components/models/app-state';

const emitter = new EventEmitter();
const apiClient = new Api(API_URL);

const appState = new AppState(emitter, apiClient);

const mainView = new MainView(emitter);

emitter.on('product:select', (productId: string) => {
  appState.selectProduct(productId);
});

emitter.on('preview:change', (product) => {
  const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const inCart = appState.isProductInCart(product.id);
  const modalCard = new ProductCardView(product, previewTemplate, emitter, inCart).render();

  modalView.render(modalCard);
  modalView.open();
});

emitter.on('modal:close', () => {
  modalView.close();
});

emitter.on('cart:add', (productId: string) => {
  appState.addProductToCart(productId);
  appState.selectProduct(productId); // обновить попап
});

emitter.on('cart:remove', (productId: string) => {
  appState.removeProductFromCart(productId);

  // Если корзина открыта, перерисовываем её
  if (modalView.isOpen()) {
    const items = appState.getCartItems();
    const cartElement = cartView.render(items);
    modalView.render(cartElement);
  }
});

emitter.on('cart:toggle', (productId: string) => {
  if (appState.isProductInCart(productId)) {
    appState.removeProductFromCart(productId);
  } else {
    appState.addProductToCart(productId);
  }
});

emitter.on('cart_counter:render', (count: number) => {
  mainView.updateCounter(count);
});

emitter.on('order:submit', (order) => {
  apiClient.post('/order', order).then(() => {
    //appState.clearCart();
    //appState.clearOrder();
    emitter.emit('cart:render');

    const successView = new SuccessView();
    const successMessage = successView.render();
    modalView.render(successMessage);
    modalView.open();
  });
});

emitter.on('order:open', () => {
  const paymentForm = orderPaymentView.render(appState);
  modalView.render(paymentForm);
  modalView.open();
});

emitter.on('order:ready', () => {
  const contactForm = orderContactsView.render(appState);
  modalView.render(contactForm);
  modalView.open();
});

emitter.on('cart:open', () => {
  const items = appState.getCartItems();
  const cartElement = cartView.render(items);
  modalView.render(cartElement);
  modalView.open();
});

emitter.on('products:loaded', (products) => {
  const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  const cards = products.map(p => {
    const inCart = appState.isProductInCart(p.id);
    return new ProductCardView(p, catalogTemplate, emitter, inCart).render();
  });
  mainView.render(cards);
});

emitter.on('products:error', (error) => {
  console.error('Product loading error:', error);
});

const modalView = new ModalView(
  document.querySelector('#modal-container')!,
  emitter
);
const cartView = new CartView(
  document.querySelector('#cart')!,
  emitter
);

const orderPaymentView = new OrderPaymentView(
  document.querySelector('#order') as HTMLTemplateElement,
  emitter
);

const orderContactsView = new OrderContactsView(
  document.querySelector('#contacts') as HTMLTemplateElement,
  emitter
);


// СТАРОЕ Удаление и добавление товаров в корзину

// function updateCartUI() {
//   const items = cartModel.getItems();
//   mainView.updateCounter(items.length);

//   const basketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
//   const cards = items.map(i => new ProductCardView(i.product, basketTemplate, emitter).render());

//   cartView.render(cards);
// }

// emitter.on<'cart:render'>('cart:render', () => {
//   updateCartUI();
// });
