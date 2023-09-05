import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Item } from 'src/models/Item';

@Injectable({
    providedIn: 'root'
})

export class SpaceService {

    constructor(
        private http:HttpClient,
        ){} 

        predictBudget(user_id:number){
            return this.http.get(environment.apiUrl+`/predict-budget/?user_id=${user_id}`)
        }

        predictItems(user_id:number){
            return this.http.get<Item[]>(environment.apiUrl+`/predict-items/?user_id=${user_id}`)
        }

        predictBudgetYear(user_id:number){
            return this.http.get(environment.apiUrl+`/predict-budget-year/?user_id=${user_id}`)
        }
    
}
