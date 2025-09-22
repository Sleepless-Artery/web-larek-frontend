import { Category, IActions, ICard } from "../types";
import { categoryClasses } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card extends Component<ICard> {
    _name: HTMLElement;
    _cost: HTMLElement;
    _description?: HTMLElement;
    _image?: HTMLImageElement;
    _category?: HTMLElement;
    _button?: HTMLButtonElement;
    _index?: HTMLElement;
    _buttonTitle: string;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);
    
        this._name = ensureElement<HTMLElement>('.card__title', container);
        this._cost = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._button = container.querySelector('.card__button');
        this._description = container.querySelector('.card__text');
        this._category = container.querySelector('.card__category');
        this._index = container.querySelector('.basket__item-index');

        if (actions?.action) {
            if (this._button) {
                this._button.addEventListener('click', actions.action);
            } else {
                container.addEventListener('click', actions.action);
            }
        }
    }

    disablePriceButton() {
        if (this._button) {
            this._button.disabled = true;
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._name, value);
    }

    get title(): string {
        return this._name.textContent || '';
    }

    set price(value: number | null) {
        this.setText(this._cost, value ? `${value} синапсов` : 'Бесценно');
        if (!value)
            this.disablePriceButton();
    }

    get price(): number {
        return Number(this._cost.textContent || '');
    }

    set category(value: Category) {
        this.setText(this._category, value);
        this._category.classList.add(categoryClasses[value]);
    }

    get category(): Category {
        return this._category.textContent as Category || null;
    }

    set index(value: string) {
        this._index.textContent = value;
    }
    
    get index(): string {
        return this._index.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonTitle(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }
}