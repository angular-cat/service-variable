import {Component, Input} from '@angular/core';
import {Product} from "../../models/product";
import {CartService} from "../../services/cart.service";

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

    @Input() product!: Product;

    quantity: number = 1;

    constructor(private cartService: CartService) {
    }

    quantityAdd() {
        this.quantity += 1;
    }

    quantityRemove() {
        this.quantity -= 1;
        if (this.quantity <= 1) this.quantity = 1;
    }

    addToCart() {
        // console.log(
        //     'Product: ' + this.product.productName + '; ' +
        //     'Price: ' + this.product.productPrice + '; ' +
        //     'Quantity: ' + this.quantity
        // );
        this.cartService.createCartItem(this.product, this.quantity).then();
        this.quantity = 1;
    }
}
