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
import { OrderModel } from './components/models/order';

const emitter = new EventEmitter();
const apiClient = new Api(API_URL);

const appState = new AppState(emitter);
const orderModel = new OrderModel(emitter);

const mainView = new MainView(emitter);

const modalView = new ModalView(document.querySelector('#modal-container')!, emitter);
const cartView = new CartView(document.querySelector('#basket') as HTMLTemplateElement, emitter);
const orderPaymentView = new OrderPaymentView(document.querySelector('#order') as HTMLTemplateElement, emitter);
const orderContactsView = new OrderContactsView(document.querySelector('#contacts') as HTMLTemplateElement, emitter);

emitter.on('products:loaded', () => {
  const cards = appState.products.map(
    p => new ProductCardView(document.querySelector('#card-catalog') as HTMLTemplateElement, emitter)
      .render(p, appState.isProductInCart(p.id), 'catalog')
  );
  mainView.render(cards);
});

emitter.on('products:loading_error', (error: Error) => {
  console.error('Product loading error:', error);
});

emitter.on('product:select', (productId: string) => {
  appState.selectedProductId = productId;
});

emitter.on('product:show_preview', (product) => {
  let state: 'remove' | 'buy' | 'buy_disabled';
  if (appState.isProductInCart(product.id)) {
    state = 'remove';
  } else if (product.price > 0) {
    state = 'buy';
  } else {
    state = 'buy_disabled';
  }
  const buttonConfig = {
    state,
    action: (e: MouseEvent) => {
      e.stopPropagation();
      if (state === 'remove') {
        emitter.emit('product:remove_from_cart', product.id);
      } else if (state === 'buy') {
        emitter.emit('product:add_to_cart', product.id);
      }
    }
  };
  modalView.render(
    new ProductCardView(document.querySelector('#card-preview') as HTMLTemplateElement, emitter, buttonConfig)
      .render(product, appState.isProductInCart(product.id), 'preview', buttonConfig)
  );
  modalView.open();
  appState.modalState = 'product_preview';
});

emitter.on('modal:close', () => {
  modalView.close();
});

emitter.on('product:add_to_cart', (productId: string) => {
  appState.addProductToCart(productId);
  appState.selectedProductId = productId;
});

emitter.on('cart:render_counter', (count: number) => {
  mainView.updateCounter(count);
});

emitter.on('order:open_payment_form', () => {
  orderModel.clearFormData();
  orderModel.setItems(appState.cartItems);
  const price = orderModel.calculateTotalPrice();

  modalView.render(orderPaymentView.render());
  modalView.open();
  appState.modalState = 'payment';
});

emitter.on('order:open_contacts_form', () => {
  modalView.render(orderContactsView.render());
  modalView.open();
  appState.modalState = 'contacts';
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

emitter.on('order:validate_payment_form', (formData) => {
  const validationResult = orderModel.validatePaymentForm(formData);
  orderPaymentView.updateValidationResult(validationResult);
});

emitter.on('order:validate_contacts_form', (formData) => {
  const validationResult = orderModel.validateContactsForm(formData);
  orderContactsView.updateValidationResult(validationResult);
});

emitter.on('order:submit_request', () => {
  const order = orderModel.getOrder();
  apiClient.post('/order', order).then(() => {
    const successView = new SuccessView(orderModel.calculateTotalPrice(), emitter);
    const successMessage = successView.render();

    modalView.render(successMessage);
    modalView.open();
    appState.modalState = 'success';
    appState.clearCart();
    orderModel.clear();
  }).catch((error) => {
    console.error('Ошибка при оформлении заказа:', error);
  });
});

emitter.on('cart:open_modal', () => {
  orderModel.setItems(appState.cartItems);
  const cartCards = appState.cartItems.map(
    (item, index) => new ProductCardView(document.querySelector('#card-basket') as HTMLTemplateElement, emitter)
      .render(item, true, 'cart', undefined, index)
  );

  const cartElement = cartView.render(cartCards);
  cartView.updateTotalPrice(orderModel.calculateTotalPrice());
  modalView.render(cartElement);
  modalView.open();
  appState.modalState = 'cart';
});

emitter.on('product:remove_from_cart', (productId: string) => {
  appState.removeProductFromCart(productId, appState.modalState);
});

appState.loadProducts();
