import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { MonthlyBudget } from "src/models/MonthlyBudget";


@Injectable({
    providedIn: 'root'
})

export class ObjectivesService  {

    constructor(private http:HttpClient){}

    getNewForm(user_id:number,month:number){
        const _url = environment.apiUrl + '/get-new-form/';
        const params = {user_id:user_id,month:month}
        return this.http.get<MonthlyBudget>(_url,{params})
    }

    saveNewForm(data:MonthlyBudget){
        const _url = environment.apiUrl + '/save-new-form/';
        return this.http.post<MonthlyBudget>(_url,data)
    }

    getLastMonths(user_id:number){
        const _url = environment.apiUrl + '/get-last-months-objectives/';
        const params = {user_id:user_id}
        return this.http.get<MonthlyBudget[]>(_url,{params})
    }

    updateForm(data:any){
        const _url = environment.apiUrl + '/update-form/';
        return this.http.patch<MonthlyBudget>(_url,data)
    }

}
