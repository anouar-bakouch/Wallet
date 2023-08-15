import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Purchase } from 'src/models/Purchase';

@Injectable({
    providedIn: 'root'
})

export class ItemPurchaseService {

    constructor(private http:HttpClient){}

    getItemsCart(){
        const url = environment.apiUrl + "/get-cart/";
        // send the user id in the request
        const params = new HttpParams().set('user_id', localStorage.getItem('user_id') || '');
        return this.http.get(url, {params});
    }

    getItemInfoById(id:number){
        const url = environment.apiUrl + "/get-item/";
        const params = new HttpParams().set('IDEIMPST', id);
        return this.http.get(url, {params});
    }

    addToPurchase(item:Purchase):Observable<any>{
        const url = environment.apiUrl + "/add-purchase/";
        return this.http.post(url, item);
    }

    

}