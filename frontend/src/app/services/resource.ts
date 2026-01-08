import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ResourceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  private authHeaders(){
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }

  getResources(){
    return this.http.get<any>(
      `${this.apiUrl}/resources`,
      this.authHeaders()
    );
  }

  getAvailability(resourceId: string, date: string){
    return this.http.get<any>(
      `${this.apiUrl}/resources/${resourceId}/availability?date=${date}`,
      this.authHeaders()
    );
  }

  createBooking(data: {
    resource_id: string,
    start_time: string,
    end_time: string,
  }){
    return this.http.post<any>(
      `${this.apiUrl}/bookings`,
      data,
      this.authHeaders()
    );
  }
  
}
