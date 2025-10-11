import './scss/styles.scss';
import { Products } from './models/Products';
import { Cart } from './models/Cart';
import { Buyer } from './models/Buyer';
import { IApi, IProduct } from './types';
import { ApiService } from './ApiService';


const api: IApi = {
    async get<T>(uri: string): Promise<T> {
        console.log('GET запрос:', uri);
        return [] as unknown as T;
    },
    async post<T>(uri: string, data: object): Promise<T> {
        console.log('POST запрос:', uri, data);
        return { success: true } as unknown as T;
    }
};

class FixedApiService {
    constructor(private api: IApi) {}
    async get<T>(uri: string): Promise<T> { return this.api.get<T>(uri); }
    async post<T>(uri: string, data: object): Promise<T> { return this.api.post<T>(uri, data); }
}
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();
const apiService = new FixedApiService(api);
const galleryEl = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const basketBtn = document.querySelector('.header__basket') as HTMLElement | null;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement | null;

function updateBasketCounter() {
    const count = cartModel.getItems().length;
    if (basketCounter) {
        basketCounter.textContent = count > 0 ? String(count) : '';
    }
}
function loadProducts() {
    const products: IProduct[] = [
        { id: '1', title: '+1 час в сутках', category: 'софт-скил', description: 'Полезный бонус для продуктивности', image: './src/images/Subtract.svg', price: 750 },
        { id: '2', title: 'Бэкенд-антистресс', category: 'другое', description: 'Если планируете решать задачи в тренажёре, берите два.', image: './src/images/Subtract.svg', price: 1000 },
        { id: '3', title: 'Фреймворк куки судьбы', category: 'другое', description: 'Для любителей неожиданностей.', image: './src/images/Subtract.svg', price: 2500 }
    ];
    productsModel.setItems(products);
}

function renderCatalog() {
    if (!galleryEl) return;
    galleryEl.innerHTML = '';
    productsModel.getItems().forEach(product => {
        const card = createProductCard(product, () => openProductPreview(product));
        galleryEl.appendChild(card);
    });
}

function createProductCard(product: IProduct, onOpen: () => void): HTMLElement {
    const tpl = document.getElementById('card-catalog') as HTMLTemplateElement;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;

    (fragment.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (fragment.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;
    (fragment.querySelector('.card__category') as HTMLElement).textContent = product.category;
    (fragment.querySelector('.card__image') as HTMLImageElement).src = product.image;

    const cardRoot = fragment.querySelector('.card') as HTMLElement;
    cardRoot?.addEventListener('click', onOpen);

    const container = document.createElement('div');
    container.appendChild(fragment);
    return container.firstElementChild as HTMLElement;
}

function openProductPreview(product: IProduct) {
    const tpl = document.getElementById('card-preview') as HTMLTemplateElement;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;

    (fragment.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (fragment.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;
    (fragment.querySelector('.card__category') as HTMLElement).textContent = product.category;
    (fragment.querySelector('.card__text') as HTMLElement).textContent = product.description;
    (fragment.querySelector('.card__image') as HTMLImageElement).src = product.image;

    const buyButton = fragment.querySelector('.card__button') as HTMLButtonElement | null;
    buyButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        cartModel.addItem(product);
        updateBasketCounter();
        renderCart();
    });

    openModal(fragment);
}

function renderCart() {
    const tpl = document.getElementById('basket') as HTMLTemplateElement;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;
    const listEl = fragment.querySelector('.basket__list') as HTMLElement;
    const priceEl = fragment.querySelector('.basket__price') as HTMLElement;
    const buttonEl = fragment.querySelector('.basket__button') as HTMLButtonElement | null;

    listEl.innerHTML = '';
    cartModel.getItems().forEach((product, index) => {
        const itemTpl = (document.getElementById('card-basket') as HTMLTemplateElement).content.cloneNode(true) as DocumentFragment;
        (itemTpl.querySelector('.basket__item-index') as HTMLElement).textContent = (index + 1).toString();
        (itemTpl.querySelector('.card__title') as HTMLElement).textContent = product.title;
        (itemTpl.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

        const deleteBtn = itemTpl.querySelector('.basket__item-delete') as HTMLElement | null;
        deleteBtn?.addEventListener('click', () => {
            cartModel.removeItem(product);
            updateBasketCounter();
            renderCart();
        });

        const wrapper = document.createElement('div');
        wrapper.appendChild(itemTpl);
        listEl.appendChild(wrapper.firstElementChild as HTMLElement);
    });

    priceEl.textContent = `${cartModel.getTotal()} синапсов`;
    buttonEl?.addEventListener('click', () => renderOrderForm());
    openModal(fragment);
}

function renderOrderForm() {
    const tpl = document.getElementById('order') as HTMLTemplateElement;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;
    const addressInput = fragment.querySelector('[name="address"]') as HTMLInputElement | null;
    const submitButton = fragment.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const form = fragment.querySelector('form[name="order"]') as HTMLFormElement | null;

    if (submitButton) submitButton.disabled = true;
    addressInput?.addEventListener('input', () => {
        if (submitButton) submitButton.disabled = !(addressInput.value.trim().length > 0);
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!addressInput || !addressInput.value.trim()) return;
        buyerModel.address = addressInput.value.trim();
        renderContactsForm();
    });

    openModal(fragment);
}

function renderContactsForm() {
    const tpl = document.getElementById('contacts') as HTMLTemplateElement;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;

    const form = fragment.querySelector('form[name="contacts"]') as HTMLFormElement | null;
    const emailInput = fragment.querySelector('[name="email"]') as HTMLInputElement | null;
    const phoneInput = fragment.querySelector('[name="phone"]') as HTMLInputElement | null;
    const submitButton = fragment.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    if (submitButton) submitButton.disabled = true;

    const validate = () => {
        const e = emailInput?.value.trim() ?? '';
        const p = phoneInput?.value.trim() ?? '';
        if (submitButton) submitButton.disabled = !(e && p);
    };

    emailInput?.addEventListener('input', validate);
    phoneInput?.addEventListener('input', validate);
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (submitButton && submitButton.disabled) return;
        if (emailInput) buyerModel.email = emailInput.value.trim();
        if (phoneInput) buyerModel.phone = phoneInput.value.trim();

        const orderData = { items: cartModel.getItems(), buyer: buyerModel, total: cartModel.getTotal() };
        await apiService.post('/order', orderData);

        renderSuccess();
        cartModel.clear();
        updateBasketCounter();
    });
    openModal(fragment);
}

function renderSuccess() {
    const tpl = document.getElementById('success') as HTMLTemplateElement;
    const fragment = tpl.content.cloneNode(true) as DocumentFragment;

    const desc = fragment.querySelector('.order-success__description') as HTMLElement | null;
    if (desc) desc.textContent = `Списано ${cartModel.getTotal()} синапсов`;
    const againBtn = fragment.querySelector('.order-success__close') as HTMLButtonElement | null;

    if (againBtn) {
        againBtn.addEventListener('click', () => {
            modalContainer.style.display = 'none';
            const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
            modalContent.innerHTML = '';
            buyerModel.clear();
            renderCatalog();
        });
    }

    openModal(fragment);
}

function openModal(content: DocumentFragment | HTMLElement) {
    const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
    modalContent.innerHTML = '';
    modalContent.appendChild(content as any);
    modalContainer.style.display = 'block';
}

modalContainer.querySelector('.modal__close')?.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
    modalContent.innerHTML = '';
});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderCatalog();
    basketBtn?.addEventListener('click', () => renderCart());
    updateBasketCounter();
});
