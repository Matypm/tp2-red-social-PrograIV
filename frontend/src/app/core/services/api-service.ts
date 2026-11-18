import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    get<T>(endpoint: string, params?: any){
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`,{ 
            params,
            withCredentials: true });
    }

    post<T>(endpoint: string, datos: any){
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, datos, {
            withCredentials: true
        });
    }

    delete<T>(endpoint: string, datos: any) {
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { 
            body: datos,
            withCredentials: true });
    }

    // withCredentials en true indica al navegador q:
    // Envíe las cookies existentes al backend cuando corresponda.
    //Acepte las cookies que el backend envíe en sus respuestas, como nuestra access_token.
}
