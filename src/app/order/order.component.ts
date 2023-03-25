import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from "../services/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Order} from "../models/order";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {

    orderKey!: string | null;
    order!: Order
    private orderSubscription!: Subscription;

    constructor(private orderService: OrderService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.orderKey = this.route.snapshot.paramMap.get('key');
        this.getOrder(this.orderKey);
    }

    private getOrder(orderKey: string | null) {
        this.orderSubscription = this.orderService.getOrder(orderKey).subscribe(order => {
            this.order = order;
        })
    }

    ngOnDestroy() {
        this.orderSubscription.unsubscribe();
    }

    newOrder() {
        this.router.navigate(['/']).then();
    }
}
