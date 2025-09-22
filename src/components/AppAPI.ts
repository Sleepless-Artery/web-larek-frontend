import { ApiListResponse, IOrder, IOrderResult, IProduct } from '../types';
import { Api } from './base/api';

interface IAppApi {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IAppApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product')
        .then((data) => 
            (data as ApiListResponse<IProduct>).items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`)
        .then((item) => ({
                ...item as IProduct,
                image: this.cdn + (item as IProduct).image,
            })
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        console.log(order);
        return this.post(`/order`, order)
        .then((data) => data as IOrderResult);
      }
}