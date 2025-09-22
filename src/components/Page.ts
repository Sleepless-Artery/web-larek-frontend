import { IEvents, IPage } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Page extends Component<IPage> {
    _counter: HTMLElement;
    _catalog: HTMLElement;
    _cart: HTMLElement;
    _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._cart = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

        this._cart.addEventListener('click', () => {
            this.events.emit('cart:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}