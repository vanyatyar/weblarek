export const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek';

export const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek';

export const categoryMap: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const PaymentMethods = {
  CARD: 'card',
  CASH: 'cash',
} as const;