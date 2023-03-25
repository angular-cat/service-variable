import {CartItem} from "./cart-item";

export interface Order {
    key: any;
    orderCreated?: number;
    orderNumber?: number;
    userName: string;
    userAddress: string;
    orderedProducts: Array<CartItem>;
    orderTotalQuantity: string;
    orderStatus: string;
}
