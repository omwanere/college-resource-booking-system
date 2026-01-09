import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminBooking } from '../../services/admin-booking';
import { AdminRegistration } from '../../services/admin-registration';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    DatePipe
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit{
  bookings: any[] = [];
  loading = false;
  registrationRequests: any[] = [];
  loadingRegistrations = false;
  activeTab: 'bookings' | 'registrations' = 'bookings';

  constructor(
    private adminBooking: AdminBooking,
    private adminRegistration: AdminRegistration,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(){
      this.fetchBookings();
      this.fetchRegistrationRequests();
  }

  fetchBookings(){
    this.loading = true;
    this.adminBooking.getPendingBookings().subscribe({
      next: (res) => {
        this.bookings = res.bookings || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open('Failed to load bookings', 'Close', {
          duration: 3000,
        });
        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  approve(id: string){
    this.adminBooking.approveBooking(id).subscribe({
      next: () => {
        this.snack.open('Booking approved', 'Close', {
          duration: 2000,
        });
        this.fetchBookings();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  reject(id: string){
    this.adminBooking.rejectBooking(id).subscribe({
      next: () => {
        this.snack.open('Booking rejected', 'Close', {
          duration: 2000,
        });
        this.fetchBookings();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  fetchRegistrationRequests(){
    this.loadingRegistrations = true;
    this.adminRegistration.getPendingRegistrations().subscribe({
      next: (res) => {
        this.registrationRequests = res.requests || [];
        this.loadingRegistrations = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open('Failed to load registration requests', 'Close', {
          duration: 3000,
        });
        this.registrationRequests = [];
        this.loadingRegistrations = false;
        this.cdr.detectChanges();
      },
    });
  }

  approveRegistration(id: string){
    this.adminRegistration.approveRegistration(id).subscribe({
      next: () => {
        this.snack.open('Registration approved successfully', 'Close', {
          duration: 2000,
        });
        this.fetchRegistrationRequests();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snack.open(
          error.error?.message || 'Failed to approve registration',
          'Close',
          { duration: 3000 }
        );
        this.cdr.detectChanges();
      },
    });
  }

  rejectRegistration(id: string){
    this.adminRegistration.rejectRegistration(id).subscribe({
      next: () => {
        this.snack.open('Registration rejected', 'Close', {
          duration: 2000,
        });
        this.fetchRegistrationRequests();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }
}
