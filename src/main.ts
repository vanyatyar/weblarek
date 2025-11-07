import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
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
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const apiService = {
  sendOrder: async (order: IOrder): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: 'mock-order-id', total: order.total };
  },
  getProducts: async (): Promise<IProduct[]> => {
    try {
      const response = await fetch(`${API_URL}/product`);
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }
};

const galleryEl = document.querySelector('.gallery') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const basketBtn = document.querySelector('.header__basket') as HTMLElement;

const modal = new Modal(document.getElementById('modal-container') as HTMLElement);

const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketView = new Basket(cloneTemplate(basketTemplate), {
  onClick: () => events.emit('order:open')
});

const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);

const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

const successTemplate = document.getElementById('success') as HTMLTemplateElement;
const successView = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close();
  }
});

const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

events.on('products:changed', (data: { items: IProduct[] }) => {
  const cards = data.items.map(product => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit('card:select', { product });
      }
    });
    
    return card.render(product);
  });
  
  galleryEl.replaceChildren(...cards);
});

events.on('card:select', (data: { product: IProduct }) => {
  productsModel.setSelectedProduct(data.product);
});

events.on('product:selected', (data: { product: IProduct }) => {
  const previewElement = cloneTemplate(cardPreviewTemplate);
  const preview = new CardPreview(previewElement, {
    onClick: (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('card__button')) {
        if (cartModel.contains(data.product.id)) {
          events.emit('basket:remove', { product: data.product });
        } else {
          if (data.product.price !== null && data.product.price !== 0) {
            events.emit('basket:add', { product: data.product });
          }
        }
        modal.close();
      }
    }
  });

  const isInCart = cartModel.contains(data.product.id);
  const isAvailable = data.product.price !== null && data.product.price !== 0;
  
  preview.render({...data.product,
    buttonText: !isAvailable ? 'Недоступно' : (isInCart ? 'Удалить из корзины' : 'Купить'),
    buttonDisabled: !isAvailable
  });

  modal.open();
  modal.setContent(preview.container);
});

events.on('cart:changed', (data: { items: IProduct[] }) => {
  const count = data.items.length;
  if (basketCounter) {
    basketCounter.textContent = count > 0 ? count.toString() : '';
  }

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
  updateOrderForm();
});

events.on('order.address:change', (data: { address: string }) => {
  buyerModel.setAddress(data.address);
  updateOrderForm();
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();
  const orderErrors = { payment: errors.payment, address: errors.address };
  const orderErrorMessages = Object.values(orderErrors).filter(Boolean);

  if (orderErrorMessages.length === 0) {
    updateContactsForm();
    modal.open();
    modal.setContent(contactsForm.container);
  } else {
    orderForm.render({
      ...buyerModel.getData(),
      valid: false,
      errors: orderErrorMessages.join(', ')
    });
  }
});

events.on('contacts.email:change', (data: { email: string }) => {
  buyerModel.setEmail(data.email);
  updateContactsForm();
});

events.on('contacts.phone:change', (data: { phone: string }) => {
  buyerModel.setPhone(data.phone);
  updateContactsForm();
});

events.on('contacts:submit', async () => {
  
  const errors = buyerModel.validate();
  
  if (Object.keys(errors).length === 0) {
    try {
      const order: IOrder = {
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotal(),
        buyer: buyerModel.getData() as IBuyer
      };
      
      await apiService.sendOrder(order);
      
      successView.render({ total: cartModel.getTotal() });
      
      modal.setContent(successView.container);
      
      
      // Очищаем данные
      cartModel.clear();
      buyerModel.clear();
      
    } catch (error) {
      contactsForm.render({
        ...buyerModel.getData(),
        valid: true,
        errors: 'Ошибка при оформлении заказа'
      });
    }
  } else {
    const contactErrors = { email: errors.email, phone: errors.phone };
    const contactErrorMessages = Object.values(contactErrors).filter(Boolean);
    
    contactsForm.render({
      ...buyerModel.getData(),
      valid: false,
      errors: contactErrorMessages.join(', ')
    });
  }
});

function updateOrderForm(): void {
  const errors = buyerModel.validate();
  const orderErrors = { payment: errors.payment, address: errors.address };
  const orderErrorMessages = Object.values(orderErrors).filter(Boolean);
  
  const isOrderValid = Boolean(buyerModel.payment) && Boolean(buyerModel.address);

  orderForm.render({
    ...buyerModel.getData(),
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
    ...buyerModel.getData(),
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

  if (basketBtn) {
    basketBtn.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }
}
init();