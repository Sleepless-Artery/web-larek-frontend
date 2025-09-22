import { Model, Product } from "./base/Model";
import { FormErrors, IAppState, ICatalog, IContactForm, IDeliveryForm, IOrder, IProduct } from "../types";

export class AppData extends Model<IAppState> {
    catalog: Product[];
    cart: Product[] = [];
    formErrors: FormErrors = {};
    preview: string | null;
    order: IOrder = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };

    clearCart() {
        this.cart = [];
        this.updateCart();
    }

    clearOrder() {
        this.order = {
            payment: 'online',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0
        };
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => {
            return new Product(item, this.events);
        });
        this.emitChanges('catalog:changed', {catalog: this.catalog});
    }

    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToCart(item: Product) {
        if (this.cart.indexOf(item)) {
            this.cart.push(item);
            this.updateCart();
        }
    }

    removeFromCart(item: Product) {
        this.cart = this.cart.filter(it => it != item);
        this.updateCart();
    }

    updateCart() {
        this.emitChanges('counter:changed', this.cart);
        this.emitChanges('cart:changed', this.cart);
    }

    takeDeliveryField(field: keyof IDeliveryForm, value: string) {
        this.order[field] = value;
        if (this.validateDelivery()) {
            this.events.emit('delivery:valid', this.order);
        }
    }

    takeContactField(field: keyof IContactForm, value: string) {
        this.order[field] = value;
        if (this.validateContact()) {
            this.events.emit('contact:valid', this.order);
        }
    }

    validateDelivery() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = "Необходимо указать адрес";
        }
        this.formErrors = errors;
        this.events.emit("errors:changed", this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContact() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = "Необходимо указать эл. почту";
        }
        if (!this.order.phone) {
            errors.phone = "Необходимо указать номер телефона";
        }
        this.formErrors = errors;
        this.events.emit("errors:changed", this.formErrors);
        return Object.keys(errors).length === 0;
    }
}