import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CartService} from "../services/cart.service";
import {Subscription} from "rxjs";
import {CartItem} from "../models/cart-item";
import {OrderService} from "../services/order.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {

    public cartItems!: CartItem[];
    private cartSubscription!: Subscription;

    public orderForm!: FormGroup;
    public quantity: number = 0;
    private orderNumber: number = 1;
    private ordersSubscription!: Subscription;

    constructor(private formBuilder: FormBuilder,
                private cartService: CartService,
                private orderService: OrderService,
                private router: Router) {
    }

    async ngOnInit() {
        this.getCartItems().then();
        this.getOrderNumber();
        this.buildForm();
    }

    async getCartItems() {
        this.cartSubscription = (await this.cartService.getCartItems()).subscribe((cartItems: CartItem[]) => {
            this.cartItems = cartItems;
            this.quantity = this.cartService.getCartItemsQuantity(cartItems);
        });
    }

    private buildForm() {
        this.orderForm = this.formBuilder.group({
                userName: [''],
                userAddress: [''],
                orderedProducts: [''],
                orderTotalQuantity: [''],
                orderStatus: ['created'],
            }
        );
    }

    get orderedProducts() {
        return this.orderForm.controls['orderedProducts'];
    }

    get orderTotalQuantity() {
        return this.orderForm.controls['orderTotalQuantity'];
    }

    setOrderFormValue() {
        this.orderedProducts.setValue(this.cartItems);
        this.orderTotalQuantity.setValue(this.quantity);
    }

    getOrderNumber(): void {
        this.ordersSubscription = this.orderService.getOrdersCounter().subscribe(orderCount => {
            if (!orderCount.value) {
                this.orderService.updateOrdersCounter();
            } else this.orderNumber = orderCount.value
        })
    }

    sendOrder() {
        this.setOrderFormValue();
        this.orderService.addOrder(this.orderNumber, this.orderForm.getRawValue())
            .then(result => {
                this.cartService.clearCart().then();
                this.router.navigate(['/order', result.key]).then()
            });
    }

    ngOnDestroy() {
        this.cartSubscription.unsubscribe();
        this.ordersSubscription.unsubscribe();
    }
}
