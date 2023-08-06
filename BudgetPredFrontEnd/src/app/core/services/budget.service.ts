import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategorieBudget } from 'src/app/enums/CategorieBudget';
import { environment } from 'src/environments/environment.prod';
import { Budget } from 'src/models/Budget';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private _url:string = environment.apiUrl;

  
  constructor(private http:HttpClient) { }

  getBudgets(){
    return this.http.get(this._url+ + "/list-budget/");
  }
  
  getBudget(id:number){
    return this.http.get(this._url +  + "/list-budget/"+id);
  }


  addBudget(budget:any){
    return this.http.post(this._url +"/add-budget/", budget);
  }

  updateBudget(budget:Budget){
    return this.http.put(this._url + budget.IDEIMPST, budget);
  }

  deleteBudget(id:number){
    return this.http.delete(this._url + id);
  }

  public ItemsType = Object.keys(CategorieBudget).map(name => { 
    
    return {
      name ,
      value : CategorieBudget[name as keyof typeof CategorieBudget],
    } 
  
  });

}
