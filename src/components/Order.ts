import { IActions, IContactForm, IDeliveryForm, IEvents } from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";

export class DeliveryForm extends Form<IDeliveryForm> {
    _cardButton: HTMLButtonElement;
    _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._cardButton.classList.add('button_alt-active');

        if (actions?.action) {
            this._cardButton.addEventListener('click', actions.action);
            this._cashButton.addEventListener('click', actions.action);
        }
    }

    toggleButtons(target: HTMLElement){
        this._cardButton.classList.toggle('button_alt-active');
        this._cashButton.classList.toggle('button_alt-active');
        //target.classList.toggle('button_alt-active');
      }
    
      set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
      }
}

export class ContactForm extends Form<IContactForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}