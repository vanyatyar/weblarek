import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { ApiService } from './components/ApiService';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct, IOrder, IBuyer } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Api } from './components/base/Api'; 
class CatalogView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(products: IProduct[], onCardClick: (product: IProduct) => void): void {
    const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    const cards = products.map(product => {
      const cardElement = cloneTemplate(cardCatalogTemplate);
      const card = new CardCatalog(cardElement, {
        onClick: () => onCardClick(product)
      });
      return card.render(product);
    });
    this.container.replaceChildren(...cards);
  }
}

const events = new EventEmitter();
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const apiService = new ApiService(api);

const galleryEl = ensureElement<HTMLElement>('.gallery');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const basketBtn = ensureElement<HTMLElement>('.header__basket');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new Basket(cloneTemplate(basketTemplate), {
  onClick: () => events.emit('order:open')
});
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successView = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close();
  }
});
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const catalogView = new CatalogView(galleryEl);

events.on('products:changed', (data: { items: IProduct[] }) => {
  catalogView.render(data.items, (product) => {
    events.emit('card:select', { product });
  });
});

events.on('card:select', (data: { product: IProduct }) => {
  productsModel.setSelectedProduct(data.product);
});

events.on('product:selected', (data: { product: IProduct }) => {
  const previewElement = cloneTemplate(cardPreviewTemplate);
  const preview = new CardPreview(previewElement, {
    onClick: () => {
      if (data.product.price !== null && data.product.price !== 0) {
        if (cartModel.contains(data.product.id)) {
          events.emit('basket:remove', { product: data.product });
        } else {
          events.emit('basket:add', { product: data.product });
        }
      }
      modal.close();
    }
  });
  const isInCart = cartModel.contains(data.product.id);
  const isAvailable = data.product.price !== null && data.product.price !== 0;
  preview.render({
    ...data.product,
    buttonText: !isAvailable ? 'Недоступно' : (isInCart ? 'Удалить из корзины' : 'Купить'),
    buttonDisabled: !isAvailable
  });
  modal.open();
  modal.setContent(preview.container);
});

events.on('cart:changed', (data: { items: IProduct[] }) => {
  const count = data.items.length;
  basketCounter.textContent = count.toString();
  const basketItems = data.items.map((item, index) => {
    const basketItemElement = cloneTemplate(cardBasketTemplate);
    const basketCard = new CardBasket(basketItemElement, {
      onClick: () => events.emit('basket:remove', { product: item })
    });
    return basketCard.render({ ...item, index: index + 1 });
  });
  basketView.render({
    items: basketItems,
    total: cartModel.getTotal(),
    buttonDisabled: basketItems.length === 0
  });
});

events.on('basket:add', (data: { product: IProduct }) => {
  cartModel.addItem(data.product);
});

events.on('basket:remove', (data: { product: IProduct }) => {
  cartModel.removeItem(data.product);
});

events.on('basket:open', () => {
  modal.open();
  modal.setContent(basketView.container);
});

events.on('buyer:changed', () => {
  updateOrderForm();
  updateContactsForm();
});

events.on('order:open', () => {
  updateOrderForm();
  modal.open();
  modal.setContent(orderForm.container);
});

events.on('order.payment:change', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.setPayment(data.payment);
});

events.on('order.address:change', (data: { address: string }) => {
  buyerModel.setAddress(data.address);
});

events.on('order:submit', () => {
  const isOrderValid = Boolean(buyerModel.payment) && Boolean(buyerModel.address);
  
  if (isOrderValid) {
    updateContactsForm();
    modal.open();
    modal.setContent(contactsForm.container);
  } else {
    updateOrderForm();
  }
});

events.on('contacts.email:change', (data: { email: string }) => {
  buyerModel.setEmail(data.email);
});

events.on('contacts.phone:change', (data: { phone: string }) => {
  buyerModel.setPhone(data.phone);
});

events.on('contacts:submit', async () => {
  try {
    const order: IOrder = {
      payment: buyerModel.payment === 'card' ? 'online' : 'receipt', 
      email: buyerModel.email,
      phone: buyerModel.phone,
      address: buyerModel.address,
      total: cartModel.getTotal(),
      items: cartModel.getItems().map(item => item.id)
    };

    const result = await apiService.sendOrder(order);
    successView.render({ total: result.total });
    modal.setContent(successView.container);
    cartModel.clear();
    buyerModel.clear();
  } catch (error) {
    contactsForm.render({
      ...buyerModel as Partial<IBuyer>,
      valid: false,
      errors: 'Ошибка при оформлении заказа'
    });
  }
});

function updateOrderForm(): void {
  const errors = buyerModel.validate();
  const orderErrors = { payment: errors.payment, address: errors.address };
  const orderErrorMessages = Object.values(orderErrors).filter(Boolean);
  const isOrderValid = Boolean(buyerModel.payment) && Boolean(buyerModel.address);
  orderForm.render({
    ...buyerModel as Partial<IBuyer>,
    valid: isOrderValid,
    errors: orderErrorMessages.join(', ')
  });
}

function updateContactsForm(): void {
  const errors = buyerModel.validate();
  const contactErrors = { email: errors.email, phone: errors.phone };
  const contactErrorMessages = Object.values(contactErrors).filter(Boolean);
  const isContactsValid = Boolean(buyerModel.email) && Boolean(buyerModel.phone);
  contactsForm.render({
    ...buyerModel as Partial<IBuyer>,
    valid: isContactsValid,
    errors: contactErrorMessages.join(', ')
  });
}

async function init() {
  try {
    const products = await apiService.getProducts();
    productsModel.setItems(products);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
  basketBtn.addEventListener('click', () => {
    events.emit('basket:open');
  });
}

init();