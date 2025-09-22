import './scss/styles.scss';

import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { AppApi } from './components/AppAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Product } from './components/base/Model';
import { Modal } from './components/common/Modal';
import { Cart } from './components/Cart';
import { ContactForm, DeliveryForm } from './components/Order';
import { IContactForm, IDeliveryForm, IOrder } from './types';
import { Success } from './components/Success';


const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppData({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
    action: (eve: Event) => events.emit('payment:toggle', eve.target)
});
const contact = new ContactForm(cloneTemplate(contactTemplate), events);


events.on('catalog:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            action: () => events.emit('card:selected', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        })
    });
});

events.on('card:selected', (item: Product) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        action: () => {
            events.emit('product:toggle', item);
            card.buttonTitle = (appData.cart.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
        }
    });
    modal.render({
        content: card.render({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            category: item.category,
            buttonTitle: (appData.cart.indexOf(item) < 0) ? 'Купить' : "Удалить из корзины"
        })
    });
});

events.on('product:toggle', (item: Product) => {
    if (appData.cart.indexOf(item) < 0) {
        events.emit('product:add', item);
    }
    else {
        events.emit('product:delete', item);
    }
});

events.on('product:add', (item: Product) => appData.addToCart(item));
  
events.on('product:delete', (item: Product) => appData.removeFromCart(item));

events.on('cart:changed', (items: Product[]) => {
    cart.items = items.map((item, index) => {
        const card = new Card(cloneTemplate(cardCartTemplate), {
            action: () => events.emit('product:delete', item)
        });
        return card.render({
            index: (index + 1).toString(),
            title: item.title,
            price: item.price,
        })
    })
    const total = items.reduce((total, item) => total + item.price, 0)
    cart.total = total
    appData.order.total = total;
    cart.toggleButton(total === 0);
  })
  
events.on('counter:changed', () => {
    page.counter = appData.cart.length;
});

events.on('cart:open', () => {
    modal.render({
        content: cart.render({})
    })
});

events.on('order:open', () => {
    modal.render({
        content: delivery.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    })
    console.log(appData.cart);
    appData.order.items = appData.cart.map((item) => item.id);
});

events.on('payment:toggle', (target: HTMLElement) => {
    if (!target.classList.contains('button_alt-active')) {
        delivery.toggleButtons(target);
        const method = target.getAttribute('name');
        appData.order.payment = method == "card" ? "online" : method;
        //console.log(appData.order)
    }
});

events.on('errors:changed', (errors: Partial<IOrder>) => {
    const {payment, address, email, phone} = errors;
    delivery.valid = !payment && !address;
    contact.valid = !email && !phone;
    delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: {field: keyof IDeliveryForm, value: string}) => {
    appData.takeDeliveryField(data.field, data.value)
});
  
events.on(/^contacts\..*:change/, (data: {field: keyof IContactForm, value: string}) => {
    appData.takeContactField(data.field, data.value)
});

events.on('delivery:valid', () => {
    delivery.valid = true;
});

events.on('contact:valid', () => {
    contact.valid = true;
});

events.on('order:submit', () => {
    modal.render({
        content: contact.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    })
});

events.on('contacts:submit', () => {
    console.log(appData.order);
    api.orderProducts(appData.order)
    .then((result) => {
        appData.clearCart();
        appData.clearOrder();
        const success = new Success(cloneTemplate(successTemplate), {
            action: () => {
                modal.close();
            }
        });
        success.total = result.total.toString();
  
        modal.render({
            content: success.render({})
        });
    })
    .catch(err => {
        console.error(err);
    });
});

events.on('modal:open', () => {
    page.locked = true;
});
  
events.on('modal:close', () => {
    page.locked = false;
});



api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => console.log(err));

