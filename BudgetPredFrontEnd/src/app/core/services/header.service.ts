import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currencies } from 'src/app/enums/Currencies.enum';
import { Languages } from 'src/app/enums/Languages.enum';

import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class HeaderService {

    constructor(private http:HttpClient) { }

    public Languages = Object.keys(Languages).map(name => { 
        return {
          name ,
          value : Languages[name as keyof typeof Languages],
        }   
      });

    public currencies = Object.keys(Currencies).map(name => {
        return {
          name,
          value : Currencies[name as keyof typeof Currencies],
        }   
      }
    );

    actualMonthBudget(user_id:number){
      const _url = environment.apiUrl + '/get-objectives/';
      const params = new HttpParams().set('user_id', user_id.toString());
      return this.http.get(_url, {params});

    }

    mostBoughtCategories(user_id:number){
      const _url = environment.apiUrl + '/most-bought-categories/';
      const params = new HttpParams().set('user_id', user_id.toString());
      return this.http.get(_url, {params});
    }

    userConfig(user_id:number){
      const _url = environment.apiUrl + '/user-config/';
      const params = new HttpParams().set('user_id', user_id.toString());
      return this.http.get(_url, {params});
    }

}