import { ICartItem } from '../../types';
import { IView } from '../../types';
import { EventEmitter } from '../base/event_emitter';

export class CartView implements IView<ICartItem[]> {
	constructor(private container: HTMLElement, private emitter: EventEmitter) {}

	render(data: ICartItem[]): HTMLElement {
		const template = document.querySelector('#basket') as HTMLTemplateElement;

		if (!template) {
			console.error('Basket template not found!');
			return document.createElement('div');
		}

		const basketFragment = template.content.cloneNode(true) as HTMLElement;

		const list = basketFragment.querySelector('.basket__list') as HTMLElement;
		const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

		if (!itemTemplate) {
			console.error('Card basket template not found!');
			return;
		}

		list.innerHTML = '';

		data.forEach((item, index) => {
			const itemNode = itemTemplate.content.cloneNode(true) as HTMLElement;

			const title = itemNode.querySelector('.card__title');
			const price = itemNode.querySelector('.card__price');
			const indexEl = itemNode.querySelector('.basket__item-index');
			const deleteBtn = itemNode.querySelector('.basket__item-delete');

			if (title) title.textContent = item.product.title;
			if (price) price.textContent = `${item.product.price} синапсов`;
			if (indexEl) indexEl.textContent = (index + 1).toString();

			deleteBtn?.addEventListener('click', () => {
				this.emitter.emit('cart:remove', item.product);
			});

			list.appendChild(itemNode);
		});

		const priceElement = basketFragment.querySelector('.basket__price');
		const total = data.reduce((sum, item) => sum + item.product.price, 0);
		if (priceElement) priceElement.textContent = `${total} синапсов`;

		const orderButton = basketFragment.querySelector('[data-order]');
		orderButton?.addEventListener('click', () => {
			this.emitter.emit('order:open');
		});

		this.container.innerHTML = '';
		this.container.appendChild(basketFragment);
	}

	clear(): void {
		this.container.innerHTML = '';
	}
}
