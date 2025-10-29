import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Products } from './models/Products';
import { Cart } from './models/Cart';
import { Buyer } from './models/Buyer';
import { ApiService } from './ApiService';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct, IOrder, IBuyer } from './types';

// Инициализация событий
const events = new EventEmitter();

// Инициализация моделей
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Инициализация API
const apiService = new ApiService({
  baseUrl: import.meta.env.VITE_API_ORIGIN || '',
  options: {}
});

// Получение DOM элементов
const galleryEl = document.querySelector('.gallery') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const basketBtn = document.querySelector('.header__basket') as HTMLElement;

// Инициализация компонентов View
const modal = new Modal(document.getElementById('modal-container') as HTMLElement);

// Загрузка тестовых данных
const testProducts: IProduct[] = [
  { id: '1', title: '+1 час в сутках', category: 'софт-скил', description: 'Полезный бонус для продуктивности', image: './src/images/5 Dots.svg', price: 750 },
  { id: '2', title: 'HEX-леденец', category: 'другое', description: 'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.', image: './src/images/Shell-1.svg', price: 1450 },
  { id: '3', title: 'Мамка-таймер', category: 'софт-скил', description: 'Будет стоять над душой и не давать прокрастинировать.', image: './src/images/Asterisk 3.svg', price: 0 },
  { id: '4', title: 'Фреймворк куки судьбы', category: 'дополнительное', description: 'Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.', image: './src/images/Soft Flower.svg', price: 2500 },
  { id: '5', title: 'Кнопка «Замьютить кота»', category: 'кнопка', description: 'Если орёт кот, нажмите кнопку.', image: './src/images/Vector 2.svg', price: 2000 },
  { id: '6', title: 'БЭМ-пилюлька', category: 'другое', description: 'Чтобы научиться правильно называть модификаторы, без этого не обойтись.', image: './src/images/Frame 307.svg', price: 1500 },
  { id: '7', title: 'Портативный телепорт', category: 'другое', description: 'Измените локацию для поиска работы.', image: './src/images/Polygon.svg', price: 100000 },
  { id: '8', title: 'Микровселенная в кармане', category: 'другое', description: 'Даст время для изучения React, ООП и бэкенда', image: './src/images/Butterfly.svg', price: 150000 },
  { id: '9', title: 'UI/UX-карандаш', category: 'хард-скил', description: 'Очень полезный навык для фронтендера. Без шуток.', image: './src/images/Leaf.svg', price: 10000 },
  { id: '10', title: 'Бэкенд-антистресс', category: 'другое', description: 'Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.', image: './src/images/Mithosis.svg', price: 1000 },
];

// Обработчики событий

// События продуктов
events.on('products:changed', () => {
    const products = productsModel.getItems();
    const cards = products.map(product => {
        const tpl = document.getElementById('card-catalog') as HTMLTemplateElement;
        const fragment = tpl.content.cloneNode(true) as DocumentFragment;
        const card = new CardCatalog(fragment.firstElementChild as HTMLElement, {
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
  // Создаем превью из шаблона
  const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
  const previewElement = previewTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
  
  const preview = new CardPreview(previewElement, {
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('card__button')) {
        if (cartModel.contains(data.product.id)) {
          cartModel.removeItem(data.product);
        } else {
          if (data.product.price !== null && data.product.price !== 0) {
            cartModel.addItem(data.product);
          }
        }
        modal.close();
      }
    }
  });

  const isInCart = cartModel.contains(data.product.id);
  const isAvailable = data.product.price !== null && data.product.price !== 0;
  
  preview.render({
    ...data.product,
    buttonText: !isAvailable ? 'Недоступно' : (isInCart ? 'Удалить из корзины' : 'Купить'),
    buttonDisabled: !isAvailable
  });

  modal.setContent(preview.container);
  modal.open();
});

// События корзины
events.on('cart:changed', () => {
  const count = cartModel.getCount();
  if (basketCounter) {
    basketCounter.textContent = count > 0 ? count.toString() : '';
  }
});

events.on('basket:open', () => {
  const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
  const basketElement = basketTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
  
  const basketView = new Basket(basketElement, {
    onClick: () => events.emit('order:open')
  });

  const items = cartModel.getItems().map((item, index) => {
    const basketItemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    const basketItemElement = basketItemTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
    
    const basketCard = new CardBasket(basketItemElement, {
      onClick: () => events.emit('basket:remove', { product: item })
    });
    
    return basketCard.render({ ...item, index: index + 1 });
  });

  basketView.render({
    items,
    total: cartModel.getTotal(),
    buttonDisabled: items.length === 0
  });

  modal.setContent(basketView.container);
  modal.open();
});

events.on('basket:remove', (data: { product: IProduct }) => {
  cartModel.removeItem(data.product);
});

// События заказа
events.on('order:open', () => {
  const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
  const orderElement = orderTemplate.content.cloneNode(true).firstElementChild as HTMLFormElement;
  
  const orderForm = new OrderForm(orderElement, events);
  
  orderForm.render({
    ...buyerModel.getData(),
    valid: Boolean(buyerModel.address && buyerModel.payment),
    errors: ''
  });
  
  modal.setContent(orderForm.container);
});

events.on('order.payment:change', (data: { payment: 'card' | 'cash' }) => {
  buyerModel.payment = data.payment;
  updateOrderFormValidity();
});

events.on('order.address:change', (data: { address: string }) => {
  buyerModel.address = data.address;
  updateOrderFormValidity();
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();
  const orderErrors = { payment: errors.payment, address: errors.address };
  const orderErrorMessages = Object.values(orderErrors).filter(Boolean);
  
  if (orderErrorMessages.length === 0) {
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.cloneNode(true).firstElementChild as HTMLFormElement;
    
    const contactsForm = new ContactsForm(contactsElement, events);
    
    contactsForm.render({
      ...buyerModel.getData(),
      valid: Boolean(buyerModel.email && buyerModel.phone),
      errors: ''
    });
    
    modal.setContent(contactsForm.container);
  } else {
    // Показываем ошибки в форме заказа
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    const orderElement = orderTemplate.content.cloneNode(true).firstElementChild as HTMLFormElement;
    
    const orderForm = new OrderForm(orderElement, events);
    
    orderForm.render({
      ...buyerModel.getData(),
      valid: false,
      errors: orderErrorMessages.join(', ')
    });
    
    modal.setContent(orderForm.container);
  }
});

// События контактов
events.on('contacts.email:change', (data: { email: string }) => {
  buyerModel.email = data.email;
  updateContactsFormValidity();
});

events.on('contacts.phone:change', (data: { phone: string }) => {
  buyerModel.phone = data.phone;
  updateContactsFormValidity();
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
      
      const successTemplate = document.getElementById('success') as HTMLTemplateElement;
      const successElement = successTemplate.content.cloneNode(true).firstElementChild as HTMLElement;
      
      const successView = new Success(successElement, {
        onClick: () => events.emit('success:close')
      });
      
      successView.render({ total: cartModel.getTotal() });
      modal.setContent(successView.container);
      
      cartModel.clear();
      buyerModel.clear();
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      
      const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
      const contactsElement = contactsTemplate.content.cloneNode(true).firstElementChild as HTMLFormElement;
      
      const contactsForm = new ContactsForm(contactsElement, events);
      
      contactsForm.render({
        ...buyerModel.getData(),
        valid: true,
        errors: 'Ошибка при оформлении заказа. Попробуйте еще раз.'
      });
      
      modal.setContent(contactsForm.container);
    }
  } else {
    const contactErrors = { email: errors.email, phone: errors.phone };
    const contactErrorMessages = Object.values(contactErrors).filter(Boolean);
    
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.cloneNode(true).firstElementChild as HTMLFormElement;
    
    const contactsForm = new ContactsForm(contactsElement, events);
    
    contactsForm.render({
      ...buyerModel.getData(),
      valid: false,
      errors: contactErrorMessages.join(', ')
    });
    
    modal.setContent(contactsForm.container);
  }
});

// События успеха
events.on('success:close', () => {
  modal.close();
});

// Вспомогательные функции
function updateOrderFormValidity(): void {
  const errors = buyerModel.validate();
  const orderErrors = { payment: errors.payment, address: errors.address };
  const orderErrorMessages = Object.values(orderErrors).filter(Boolean);
}

function updateContactsFormValidity(): void {
  const errors = buyerModel.validate();
  const contactErrors = { email: errors.email, phone: errors.phone };
  const contactErrorMessages = Object.values(contactErrors).filter(Boolean);
}

// Инициализация приложения
function init() {
  try {
    // Используем тестовые данные вместо API
    productsModel.setItems(testProducts);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }

  // Обработчики UI событий
  if (basketBtn) {
    basketBtn.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);