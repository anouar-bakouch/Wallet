import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategorieItem } from 'src/app/enums/CategorieItem';
import { environment } from 'src/environments/environment.prod';
import { Item } from 'src/models/Item';
import { ItemPurchase } from 'src/models/ItemPurchase';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private _url_get:string = environment.apiUrl + "/list-item/";
  private _url_post = environment.apiUrl + "/add-item/";
  private _url_put = environment.apiUrl + "/update-item/"; 
  private _url_delete = environment.apiUrl + "/delete-item/";
  
  constructor(private http:HttpClient) { }

  getItems(nbrOfPage:number){
    // ading pagination for  the request
    const n_url = this._url_get + "?page="+nbrOfPage+"&page_size=10";
    return this.http.get(n_url);
  }


  addToCart(item:ItemPurchase){
    const url = environment.apiUrl + "/add-cart/";
    return this.http.post(url, item);
  }


  getItem(id:number){
    return this.http.get(this._url_get + id);
  }

  getItemsByCategorie(categorie:string,page:number){
    const params = new HttpParams().set('categorie', categorie).set('page', page.toString()).set('page_size', '10');
    const url_filter = environment.apiUrl + "/list-item-categorie/";
    return this.http.get(url_filter, {params});
  }

  addItem(item:any){
    return this.http.post(this._url_post, item);
  }


  updateItem(item:any,id:number){
    const _url = this._url_put + id + '/';
    return this.http.patch(_url ,item);
  }

  deleteBudget(id:number){
    return this.http.delete(this._url_delete + id+'/');
  }

  public ItemsType = Object.keys(CategorieItem).map(name => { 
    return {
      name ,
      value : CategorieItem[name as keyof typeof CategorieItem],
    }   
  });
  
}
