import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment.local';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    get<T>(endpoint: string){
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
    }

    post<T>(endpoint: string, datos: any){
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, datos);
    }
}
