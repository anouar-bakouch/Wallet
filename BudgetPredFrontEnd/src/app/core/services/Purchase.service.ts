import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
    providedIn: 'root'
})

export class PurchaseService {

    
    constructor(
        private http:HttpClient,
        ){} 

        getPurchaseByUser(id:number){
            return this.http.get(environment.apiUrl+`/list-purchase/?user_id=${id}`)
        }

        getPurchaseByMonth(id:number,month:string){
            const url_= environment.apiUrl + '/list-month-purchase/'
            const params = new HttpParams().set('user_id', id).set('month',month);
            return this.http.get(url_,{params})
        }

        deletePurchase(id:number){
            return this.http.delete(environment.apiUrl+`/delete-purchase/${id}/`)
        }
}
