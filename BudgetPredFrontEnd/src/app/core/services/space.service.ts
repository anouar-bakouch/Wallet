import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class SpaceService {

    
    constructor(
        private http:HttpClient,
        ){} 

        getPurchaseByUser(id:number){
            const url = environment.apiUrl + "/list-purchase/";
            const params = new HttpParams().set('user_id', id);
            return this.http.get(url, {params});
        }

        getPurchaseByMonth(id:number,month:string){
            const url_= environment.apiUrl + '/list-month-purchase/'
            const params = new HttpParams().set('user_id', id).set('month',month);
            return this.http.get(url_,{params})
        }

        predictBudget(monthly_budget:number[],user_id:number,monthly_expenses:number[],monthly_revenue:number[]){
            const url = environment.apiUrl + '/predict-budget/'
            const params = new HttpParams().set('user_id', user_id).set('monthly_budget',monthly_budget.toString()).set('monthly_expenses',monthly_expenses.toString()).set('monthly_revenue',monthly_revenue.toString());
            return this.http.post(url,{params})
        }
    

}
