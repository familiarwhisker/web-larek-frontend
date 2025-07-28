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
  modalView.render(
    new ProductCardView(document.querySelector('#card-preview') as HTMLTemplateElement, emitter)
      .render(product, appState.isProductInCart(product.id), 'preview')
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

  // Если в модальном окне отображается превью товара, обновляем его
  if (modalView.isOpen() && appState.isShowingProductPreview()) {
    const product = appState.products.find(p => p.id === productId);
    if (product) {
      modalView.render(
        new ProductCardView(document.querySelector('#card-preview') as HTMLTemplateElement, emitter)
          .render(product, appState.isProductInCart(product.id), 'preview')
      );
    }
  }
});

emitter.on('product:remove_from_cart', (productId: string) => {
  appState.removeProductFromCart(productId);

  if (modalView.isOpen()) {
    // Если в модальном окне отображается корзина, обновляем её
    if (appState.isShowingCart()) {
      const cartCards = appState.cartItems.map(
        (item, index) => new ProductCardView(document.querySelector('#card-basket') as HTMLTemplateElement, emitter)
          .render(item, true, 'cart', index)
      );
      cartView.render(cartCards);
      cartView.updateTotalPrice(appState.cartItems.reduce((sum, item) => sum + item.price, 0));
    }
    // Если в модальном окне отображается превью товара, обновляем его
    else if (appState.isShowingProductPreview()) {
      const product = appState.products.find(p => p.id === productId);
      if (product) {
        modalView.render(
          new ProductCardView(document.querySelector('#card-preview') as HTMLTemplateElement, emitter)
            .render(product, appState.isProductInCart(product.id), 'preview')
        );
      }
    }
  }
});

emitter.on('cart:render_counter', (count: number) => {
  mainView.updateCounter(count);
});

emitter.on('order:open_payment_form', () => {
  orderModel.setItems(appState.cartItems);
  orderModel.clearFormData();

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
    appState.clearCart();
    orderModel.clear();

    const successView = new SuccessView(order.total, emitter);
    const successMessage = successView.render();
    modalView.render(successMessage);
    modalView.open();
    appState.modalState = 'success';
  }).catch((error) => {
    console.error('Ошибка при оформлении заказа:', error);
  });
});

emitter.on('cart:open_modal', () => {
  const cartCards = appState.cartItems.map(
    (item, index) => new ProductCardView(document.querySelector('#card-basket') as HTMLTemplateElement, emitter)
      .render(item, true, 'cart', index)
  );

  const cartElement = cartView.render(cartCards);
  cartView.updateTotalPrice(appState.cartItems.reduce((sum, item) => sum + item.price, 0));
  modalView.render(cartElement);
  modalView.open();
  appState.modalState = 'cart';
});

appState.loadProducts();
