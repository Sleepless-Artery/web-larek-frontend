export type Category = 
    'софт-скил' | 
    'хард-скил' |
    'кнопка' |
    'другое'|
    'дополнительное';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    category: Category;
    inCart: boolean;
}

export interface ICard extends IProduct {
    index?: string;
    buttonTitle?: string;
    disablePriceButton(): void;
}

export interface ICatalog {
    items: IProduct[];
}

export interface ICart {
    items: HTMLElement[];
    total: number;
}

export interface IOrder extends IDeliveryForm, IContactForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IAppState {
    catalog: IProduct;
    cart: IProduct;
    delivery: IDeliveryForm | null;
    contact: IContactForm | null;
    order: IOrder | null;
    clearCart(): void; // очистка всей корзины
    clearOrder(): void; // очистка заказа
    setCatalog(items: IProduct[]): void; // установить товары в каталог
    setPreview(item: IProduct): void; // открыть инфо о товаре
    addToCart(item: IProduct): void; // добавить в корзину товар
    removeFromCart(id: string): void; // удалить из корзины товар
    updateCart(): void; // будет оповещать всех об изменении корзины
    takeDeliveryField(field: keyof IDeliveryForm, value: string): void; // установить значение в данные доставки
    takeContactField(field: keyof IContactForm, value: string): void; // установить значение в данные контактов
    validateDelivery(): boolean; // валидация данных доставки
    validateContact(): boolean; // валидация данных контактов
}

export interface IPage {
    catalog: HTMLElement[];
    counter: number;
}

export interface IApi {
    getProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    orderProducts(order: IOrder): Promise<IOrderResult>;
}

export interface IDeliveryForm {
    payment: string;
    address: string;
}

export interface IContactForm {
    email: string;
    phone: string;
}

// проверка валидности формы
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// отображаемый контент в модальном окне
export interface IModal {
    content: HTMLElement;
}

export interface IActions {
    action: (event: MouseEvent) => void;
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    action: () => void;
}

// типы для ивентов
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// типы для апишек
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';