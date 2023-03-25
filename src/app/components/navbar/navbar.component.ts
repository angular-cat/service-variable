import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Subscription} from "rxjs";
import {CartItem} from "../../models/cart-item";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    quantity: number = 0;

    cartSubscription!: Subscription;

    constructor(private cartService: CartService) {
    }

    async ngOnInit() {
        this.cartSubscription = (await this.cartService.getCartItems()).subscribe((cartItems: CartItem[]) => {
            this.quantity = this.cartService.getCartItemsQuantity(cartItems);
        });
    }

    ngOnDestroy() {
        this.cartSubscription.unsubscribe();
    }
}
