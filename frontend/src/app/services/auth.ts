import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Auth {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient){}

  login(email: string, password: string){
    return this.http  
      .post<any>(`${this.apiUrl}/auth/login`, {email, password})
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  register(data: {
    name: string,
    email: string,
    password: string,
    role: 'ADMIN' | 'USER';
  }){
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  logout(){
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): 'ADMIN' | 'USER' | null {
    const token = this.getToken();
    if(!token){
      return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
}
