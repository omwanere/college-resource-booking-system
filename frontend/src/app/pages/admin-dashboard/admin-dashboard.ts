import { Component, OnInit } from '@angular/core';
import { AdminBooking } from '../../services/admin-booking';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit{
  bookings: any[] = [];
  loading = false;

  constructor(
    private adminBooking: AdminBooking,
    private snack: MatSnackBar
  ){}

  ngOnInit(){
      this.fetchBookings();
  }

  fetchBookings(){
    this.loading = true;
    this.adminBooking.getPendingBookings().subscribe({
      next: (res) => {
        this.bookings = res.bookings;
        this.loading = false;
      },
      error: () => {
        this.snack.open('Failed to load bookings', 'Close', {
          duration: 3000,
        });
        this.loading = false;
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
      },
    });
  }
}
