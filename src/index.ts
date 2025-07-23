import './scss/styles.scss';

import Api from './components/base/api';
import { EventEmitter } from './components/base/event_emitter';

import { ProductCardView } from './components/views/product-card';
import { ModalView } from './components/views/modal';
import { CartView } from './components/views/cart';
import { MainView } from './components/views/main';
import { OrderPaymentView } from './components/views/forms/order-payment';
import { OrderContactsView } from './components/views/forms/order-contacts';
import { SuccessView } from './components/views/success';

import { IProduct } from './types';

import { ProductModel } from './components/models/product-model';
import { CartModel } from './components/models/cart-model';
import { OrderModel } from './components/models/order-model';

const emitter = new EventEmitter();
const apiClient = new Api(process.env.API_ORIGIN || '');

// Подписки на события
emitter.on('product:select', (product) => {
  productModel.selectProduct(product.id);
});

emitter.on('preview:change', (product) => {
  const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const modalCard = new ProductCardView(product, previewTemplate, emitter).render();

  modalView.render(modalCard);
  modalView.open();
});

emitter.on('modal:close', () => {
  modalView.close();
});

emitter.on('cart:render', () => {
  const items = cartModel.getItems();
  cartView.render(items);
  mainView.updateCounter(items.length);
});

emitter.on('cart:add', (product) => {
  cartModel.addProduct(product);
  emitter.emit('cart:render');
});

emitter.on('cart:remove', (product) => {
  cartModel.removeProduct(product);
  emitter.emit('cart:render');
});

emitter.on('order:submit', (order) => {
  apiClient.post('/order', order).then(() => {
    cartModel.clear();
    orderModel.clear();
    emitter.emit('cart:render');

    const successView = new SuccessView();
    const successMessage = successView.render();
    modalView.render(successMessage);
    modalView.open();
  });
});

emitter.on('order:open', () => {
  const paymentForm = orderPaymentView.render(orderModel);
  modalView.render(paymentForm);
  modalView.open();
});

emitter.on('order:ready', () => {
  const contactForm = orderContactsView.render(orderModel);
  modalView.render(contactForm);
  modalView.open();
});

emitter.on('cart:open', () => {
  const items = cartModel.getItems();
  const cartElement = cartView.render(items);
  modalView.render(cartElement);
  modalView.open();
});

// Объявление моделей
const productModel = new ProductModel(emitter);
const cartModel = new CartModel(emitter);
const orderModel = new OrderModel(emitter);

// Инициализация Views
const mainView = new MainView(emitter);

apiClient.get<IProduct[]>('/products').then((products) => {
  productModel.setProducts(products);

  const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  const cards = products.map(p =>
    new ProductCardView(p, catalogTemplate, emitter).render()
  );

  mainView.render(cards);
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
