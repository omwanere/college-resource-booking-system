import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminRegistration {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }

  getPendingRegistrations() {
    return this.http.get<any>(
      `${this.apiUrl}/admin/registrations/pending`,
      this.authHeaders()
    );
  }

  approveRegistration(id: string) {
    return this.http.patch(
      `${this.apiUrl}/admin/registrations/${id}/approve`,
      {},
      this.authHeaders()
    );
  }

  rejectRegistration(id: string) {
    return this.http.patch(
      `${this.apiUrl}/admin/registrations/${id}/reject`,
      {},
      this.authHeaders()
    );
  }
}
