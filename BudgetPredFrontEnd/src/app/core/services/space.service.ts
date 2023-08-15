import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class SpaceService {

    monthly_budgets : number [] = [];
    monthly_expenses : number [] = [];
    monthly_savings : number [] = [];

    constructor(private http:HttpClient){} 

    

    
    

}
