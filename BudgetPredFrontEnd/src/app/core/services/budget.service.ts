import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Budget } from 'src/models/Budget';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private _url:string = environment.apiUrl + "/list-budget/";
  
  constructor(private http:HttpClient) { }

  getBudgets(){
    return this.http.get(this._url);
  }
  
  getBudget(id:number){
    return this.http.get(this._url + id);
  }


  addBudget(budget:any){
    return this.http.post(this._url, budget);
  }

  updateBudget(budget:Budget){
    return this.http.put(this._url + budget.IDEIMPST, budget);
  }

  deleteBudget(id:number){
    return this.http.delete(this._url + id);
  }

}
