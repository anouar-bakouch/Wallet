import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Form } from "src/models/Form";
import { MonthlyBudget } from "src/models/MonthlyBudget";


@Injectable({
    providedIn: 'root'
})

export class ObjectivesService  {

    constructor(private http:HttpClient){}

    getNewForm(user_id:number){
        const _url = environment.apiUrl + '/get-new-form/';
        const params = {user_id:user_id}
        return this.http.get<Form>(_url,{params})
    }

    saveNewForm(data:MonthlyBudget){
        const _url = environment.apiUrl + '/save-new-form/';
        return this.http.post<MonthlyBudget>(_url,data)
    }

}
