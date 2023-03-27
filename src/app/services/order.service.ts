import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Order} from "../models/order";
import {firstValueFrom, map, Observable, take} from "rxjs";
import {OrderCount} from "../models/order-count";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    // firebase products collection URL
    private firebaseURL = 'orders'
    constructor(private firebase: AngularFireDatabase) {
    }

    //  create one order in to firebase
    public async addOrder(order: Order) {

        let orderNumber = await firstValueFrom(this.getOrdersCounter().pipe(take(1)));
        // let orderNumber = await this.getOrdersCounter().pipe(take(1)).toPromise();

         this.updateOrdersCounter();
        return this.firebase.list(`${this.firebaseURL}`).push({
            orderNumber: orderNumber.value,
            orderCreated: new Date().getTime(),
            ...order
        })
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
