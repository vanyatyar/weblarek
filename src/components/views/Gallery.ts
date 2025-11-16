import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CardCatalog } from './CardCatalog';

export class CatalogView {
    constructor(private container: HTMLElement) {}

    render(products: IProduct[], onCardClick: (product: IProduct) => void): void {
        const template = ensureElement<HTMLTemplateElement>('#card-catalog');
        const cards = products.map(product => {
            const el = cloneTemplate(template);
            const card = new CardCatalog(el, { onClick: () => onCardClick(product) });
            return card.render(product);
        });
        this.container.replaceChildren(...cards);
    }
}
