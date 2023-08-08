import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategorieBudget } from 'src/app/enums/CategorieBudget';
import { environment } from 'src/environments/environment.prod';
import { Budget } from 'src/models/Budget';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private _url_get:string = environment.apiUrl + "/list-budget/";
  private _url_post = environment.apiUrl + "/add-budget/";
  private _url_put = environment.apiUrl + "/update-budget/"; 
  private _url_delete = environment.apiUrl + "/delete-budget/";
  
  constructor(private http:HttpClient) { }

  getBudgets(){
    return this.http.get(this._url_get);
  }
  
  getBudget(id:number){
    return this.http.get(this._url_get + id);
  }


  addBudget(budget:any){

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  
    return this.http.post(this._url_post, budget, {headers: headers});
  }

  updateBudget(budget:Budget){
    return this.http.put(this._url_put + budget.IDEIMPST, budget);
  }

  deleteBudget(id:number){
    return this.http.delete(this._url_delete + id);
  }

  public ItemsType = Object.keys(CategorieBudget).map(name => { 
    
    return {
      name ,
      value : CategorieBudget[name as keyof typeof CategorieBudget],
    } 
  
  });
  
  predictBudget(budget:Budget){
    return this.http.post(environment.apiUrl + "/predict-budget/"+budget.IDEIMPST, budget);
  }

}
