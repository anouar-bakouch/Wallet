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



        predictBudget(user_id:number){
            return this.http.get(environment.apiUrl+`/predict-budget/?user_id=${user_id}`)
        }
    

}
