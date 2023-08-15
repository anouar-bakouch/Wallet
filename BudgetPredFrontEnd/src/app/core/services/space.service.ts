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
    

}
