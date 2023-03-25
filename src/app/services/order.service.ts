import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Order} from "../models/order";
import {map, Observable, take} from "rxjs";
import {OrderCount} from "../models/order-count";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    // firebase products collection URL
    private firebaseURL = 'orders'

    private serviceOrderNumberGlobal1!: number;
    private serviceOrderNumberGlobal2!: number;

    private serviceOrderNumberGlobal3!: Observable<OrderCount>

    constructor(private firebase: AngularFireDatabase) {
    }

    //  create one order in to firebase
    public addOrder(orderNumber: number, order: Order) {

        let serviceOrderNumber1;

        let serviceOrderNumber2 = this.getOrdersCounter().pipe(take(1)).subscribe(counter => {
                console.log('Counter addOrderpipe: ' + counter.value)
                serviceOrderNumber1 = counter.value;
                this.serviceOrderNumberGlobal1 = counter.value;
                this.updateOrderNumber(counter.value);
            }
        )

        let serviceOrderNumber3
        this.getOrdersCounter().subscribe(counter => {
            console.log('Counter subscribe: ' + counter.value)
            serviceOrderNumber3 = counter.value
            this.updateOrderNumber(counter.value);
        });

        this.serviceOrderNumberGlobal3 = this.getOrdersCounter();

        console.log('Counter serviceaddOrder1: ' + serviceOrderNumber1);
        console.log('Counter serviceaddOrder2: ' + serviceOrderNumber2);
        console.log('Counter serviceaddOrder3: ' + serviceOrderNumber3);

        console.log('Counter serviceaddOrderGlobal1: ' + this.serviceOrderNumberGlobal1);
        console.log('Counter serviceaddOrderGlobal2: ' + this.serviceOrderNumberGlobal2);
        console.log('Counter serviceaddOrderGlobal3: ' + this.serviceOrderNumberGlobal3);

        this.updateOrdersCounter();
        return this.firebase.list(`${this.firebaseURL}`).push({
            orderNumber: orderNumber,
            orderCreated: new Date().getTime(),
            ...order
        })
    }

    private updateOrderNumber(counter: number) {
        console.log('Counter updateFunctionCounter: ' + counter);
        this.serviceOrderNumberGlobal2 = counter;
        console.log('Counter updateFunctionGlobal2: ' + this.serviceOrderNumberGlobal2);
    }

    // create or update orders counter
    public updateOrdersCounter() {
        let counter = this.firebase.object(`${this.firebaseURL}/orderCount`);
        counter.snapshotChanges()
            .pipe(take(1))
            .subscribe((item: any) => {
                let count = ((item.payload.hasChild('value')) ? item.payload.val()['value'] + 1 : 1);
                counter.update({
                    value: count,
                }).then();
            });
    }

    //get orders counter value
    public getOrdersCounter(): Observable<OrderCount> {
        return this.firebase.object<OrderCount>(`${this.firebaseURL}/orderCount`).snapshotChanges()
            .pipe(map((c: any) => ({key: c.payload.key, ...c.payload.val()})));
    }

    // read one order
    public getOrder(key: string | null): Observable<Order> {
        return this.firebase.object<Order>(`${this.firebaseURL}/${key}`).snapshotChanges()
            .pipe(map((c: any) => ({key: c.payload.key, ...c.payload.val()})));
    }
}
