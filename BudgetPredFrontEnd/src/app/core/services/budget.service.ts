import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategorieBudget } from 'src/app/enums/CategorieBudget';
import { environment } from 'src/environments/environment.prod';
import { Item } from 'src/models/Item';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private _url_get:string = environment.apiUrl + "/list-item/";
  private _url_post = environment.apiUrl + "/purchase-budget/";
  private _url_put = environment.apiUrl + "/update-budget/"; 
  private _url_delete = environment.apiUrl + "/delete-budget/";
  
  constructor(private http:HttpClient) { }

  getItems(nbrOfPage:number){
    // ading pagination for  the request
    const n_url = this._url_get + "?page="+nbrOfPage+"\ ";
    return this.http.get(n_url);
  }
  
  getItem(id:number){
    return this.http.get(this._url_get + id);
  }

  addBudget(item:any){
    return this.http.post(this._url_post, item);
  }

  updateBudget(item:Item){
    return this.http.put(this._url_put + item.IDEIMPST, item);
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
  
}
