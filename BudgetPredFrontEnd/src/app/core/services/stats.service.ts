import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class StatsService {

    constructor(private http: HttpClient) { }

    getStats() {
        const url = environment.apiUrl + '/stats/';
        const user_id = localStorage.getItem('user_id');
        const params = new HttpParams().set('user_id', String(user_id));
        return this.http.get(url, { params });
    }

}