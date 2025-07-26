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
import { OrderModel } from './components/models/order-model';

const emitter = new EventEmitter();
const apiClient = new Api(API_URL);

const appState = new AppState(emitter, apiClient);
const orderModel = new OrderModel(emitter);

const mainView = new MainView(emitter);

emitter.on('product:select', (productId: string) => {
  appState.selectProduct(productId);
});

emitter.on('product:show_preview', (product) => {
  const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const inCart = appState.isProductInCart(product.id);
  const modalCard = new ProductCardView(product, previewTemplate, emitter, inCart).render();

  modalView.render(modalCard);
  modalView.open();
});

emitter.on('modal:close', () => {
  modalView.close();
});

emitter.on('product:add_to_cart', (productId: string) => {
  appState.addProductToCart(productId);
  appState.selectProduct(productId); // обновить попап
});

emitter.on('product:remove_from_cart', (productId: string) => {
  appState.removeProductFromCart(productId);

  // Если корзина открыта, перерисовываем её
  if (modalView.isOpen()) {
    const items = appState.getCartItems();
    const cartElement = cartView.render(items);
    modalView.render(cartElement);
  }
});

emitter.on('cart:render_counter', (count: number) => {
  mainView.updateCounter(count);
});

emitter.on('order:open_payment_form', () => {
  // Устанавливаем товары из корзины в заказ
  const cartItems = appState.getCartItems();
  orderModel.setItems(cartItems);

  const paymentForm = orderPaymentView.render({}); // всегда пусто
  modalView.render(paymentForm);
  modalView.open();
});

emitter.on('order:open_contacts_form', () => {
  const contactForm = orderContactsView.render({}); // всегда пусто
  modalView.render(contactForm);
  modalView.open();
});

emitter.on('order:set_payment_method', (data: { method: 'online' | 'cash' }) => {
  orderModel.setPaymentMethod(data.method);
});

emitter.on('order:set_address', (data: { value: string }) => {
  orderModel.setAddress(data.value);
});

emitter.on('order:set_contacts', (data: { email: string; phone: string }) => {
  orderModel.setContacts(data.email, data.phone);
  emitter.emit('order:submit_request');
});

emitter.on('order:submit_request', () => {
  const order = orderModel.getOrder();
  apiClient.post('/order', order).then(() => {
    // Очищаем корзину и заказ после успешного оформления
    appState.clearCart();
    orderModel.clear();

    const successView = new SuccessView(emitter, order.total);
    const successMessage = successView.render();
    modalView.render(successMessage);
    modalView.open();
  }).catch((error) => {
    console.error('Ошибка при оформлении заказа:', error);
  });
});

emitter.on('cart:open_modal', () => {
  const items = appState.getCartItems();
  const cartElement = cartView.render(items);
  modalView.render(cartElement);
  modalView.open();
});

emitter.on('catalog:loaded', (products) => {
  const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  const cards = products.map(p => {
    const inCart = appState.isProductInCart(p.id);
    return new ProductCardView(p, catalogTemplate, emitter, inCart).render();
  });
  mainView.render(cards);
});

emitter.on('catalog:error', (error) => {
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

// emitter.on<'cart:render_items'>('cart:render_items', () => {
//   updateCartUI();
// });
