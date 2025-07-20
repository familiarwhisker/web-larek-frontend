import './scss/styles.scss';

import Api from './components/base/api';
import { EventEmitter } from './components/base/event_emitter';

import { ProductCardView } from './components/views/product-card';
import { ModalView } from './components/views/modal';
import { CartView } from './components/views/cart';
import { OrderFormView } from './components/views/order-form';

import { IProduct } from './types';

import { ProductModel } from './components/models/product-model';
import { CartModel } from './components/models/cart-model';
import { OrderModel } from './components/models/order-model';

// 1. Initialize core services
const emitter = new EventEmitter();
const apiClient = new Api(process.env.API_ORIGIN || '');

// 2. Initialize models
const productModel = new ProductModel(emitter);
const cartModel = new CartModel(emitter);
const orderModel = new OrderModel(emitter);

// 3. Initialize views
const productCardView = new ProductCardView(
  document.querySelector('.card-list')!,
  emitter
);
const modalView = new ModalView(
  document.querySelector('#modal-container')!,
  emitter
);
const cartView = new CartView(
  document.querySelector('#cart')!,
  emitter
);

const orderFormView = new OrderFormView(
  document.querySelector('#order-form')!,
  emitter
);

// 4. Fetch product data and render
apiClient.get<IProduct[]>('/products').then((products: IProduct[]) => {
  productModel.setProducts(products);
  productCardView.render(products);
});

// 5. Event listeners (Presenter logic)

// Open modal with selected product
emitter.on<'product:select'>('product:select', (product: IProduct) => {
  modalView.render(product);
  modalView.open();
});

// Add product to cart
emitter.on<'cart:add'>('cart:add', (product: IProduct) => {
  cartModel.addProduct(product);
  cartView.render(cartModel.getItems());
});

// Remove product from cart
emitter.on<'cart:remove'>('cart:remove', (product: IProduct) => {
  cartModel.removeProduct(product);
  cartView.render(cartModel.getItems());
});

// Close modal
emitter.on<'modal:close'>('modal:close', () => {
  modalView.close();
});

// Submit order
emitter.on<'order:submit'>('order:submit', (order) => {
  apiClient.post('/order', order).then(() => {
    cartModel.clear();
    cartView.render([]);
    orderFormView.clear?.();
    alert('Order submitted successfully!');
  });
});
