import './scss/styles.scss';

// Импорты моделей
import { Products } from './components/base/models/Products';
import { Cart } from './components/base/models/Cart';
import { Buyer } from './components/base/models/Buyer';


// Типы
import { IProduct, IBuyer } from './types';

// Для теста пока используем моковые данные (они есть в utils/data.ts)
import { apiProducts } from './utils/data';

// ================================
// 1. Создание экземпляров моделей
// ================================
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// ================================
// 2. Тестирование моделей данных
// ================================
console.log('--- Тест Products ---');
productsModel.setItems(apiProducts.items);
console.log('Все товары:', productsModel.getItems());
console.log('Товар по id:', productsModel.getItemById(apiProducts.items[0].id));

productsModel.setPreview(apiProducts.items[1]);
console.log('Товар для предпросмотра:', productsModel.getPreview());

console.log('--- Тест Cart ---');
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotalPrice());
console.log('Количество товаров:', cartModel.getCount());

cartModel.removeItem(apiProducts.items[0].id);
console.log('После удаления:', cartModel.getItems());

cartModel.clear();
console.log('После очистки:', cartModel.getItems());

console.log('--- Тест Buyer ---');
buyerModel.setField('address', 'Москва, ул. Пушкина, д. 1');
buyerModel.setField('phone', '+79990000000');
buyerModel.setField('email', 'test@mail.ru');
buyerModel.setField('payment', 'card');

console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());

buyerModel.clear();
console.log('После очистки:', buyerModel.getData());

// ================================
// 3. Работа с API
// ================================

// Экземпляр ApiService
const api = new ApiService({
  baseUrl: import.meta.env.VITE_API_ORIGIN, // берём адрес из .env
  headers: {
    'Content-Type': 'application/json'
  }
});

// Загружаем товары с сервера
api.getProducts().then((serverProducts: IProduct[]) => {
  console.log('--- Данные с сервера ---');
  console.log(serverProducts);

  // Сохраняем в модель каталога
  productsModel.setItems(serverProducts);
  console.log('Каталог в модели:', productsModel.getItems());
}).catch(err => {
  console.error('Ошибка при загрузке товаров:', err);
});
