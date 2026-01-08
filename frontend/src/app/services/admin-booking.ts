import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AdminBooking {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient){}

  private authHeaders(){
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }

  getPendingBookings() {
    return this.http.get<any>(
      `${this.apiUrl}/bookings/pending`,
      this.authHeaders()
    );
  }

  approveBooking(id: string){
    return this.http.patch(
      `${this.apiUrl}/bookings/${id}/approve`,
      {},
      this.authHeaders()
    );
  }

  rejectBooking(id: string){
    return this.http.patch(
      `${this.apiUrl}/bookings/${id}/reject`,
      {},
      this.authHeaders()
    );
  }
}
