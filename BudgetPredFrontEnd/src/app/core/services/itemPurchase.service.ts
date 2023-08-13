import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Item } from 'src/models/Item';
import { ItemPurchase } from 'src/models/ItemPurchase';

@Injectable({
    providedIn: 'root'
})

export class ItemPurchaseService {

    constructor(private http:HttpClient){}

    getItemsCart(){
        const url = environment.apiUrl + "/get-cart/";
        // send the user id in the request
        const params = new HttpParams().set('user_id', localStorage.getItem('user_id') || '');
        return this.http.get<ItemPurchase[]>(url, {params});
    }

    getItemInfoById(id:number){
        const url = environment.apiUrl + "/get-item/";
        const params = new HttpParams().set('IDEIMPST', id);
        return this.http.get<Item[]>(url, {params});
    }



}