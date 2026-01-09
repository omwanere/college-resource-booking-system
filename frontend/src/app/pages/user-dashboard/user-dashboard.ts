import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourceService } from '../../services/resource';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard implements OnInit {
  bookings: any[] = [];
  loading = false;

  constructor(
    private resourceService: ResourceService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchMyBookings();
  }

  trackByBookingId(index: number, booking: any): string {
    return booking.id;
  }

  fetchMyBookings() {
    this.loading = true;
    this.resourceService.getMyBookings().subscribe({
      next: (res) => {
        this.bookings = res?.bookings || res?.booking || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.snack.open(
          error.error?.message || error.message || 'Failed to load your bookings',
          'Close',
          {
            duration: 5000,
          }
        );
        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
