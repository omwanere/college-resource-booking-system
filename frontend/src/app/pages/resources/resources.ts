import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  MatCardModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  ],
  templateUrl: './resources.html',
})

export class Resources implements OnInit {
  resources: any[] = [];
  selectedDate: Date = new Date();
  availability: Record<string, any[]> = {};
  loading = false;

  
  constructor(
    private resourceService: ResourceService,
    private snack: MatSnackBar
  ){}
  
  ngOnInit(){
    this.fetchResources();
  }
  
  fetchResources(){
    this.loading = true;
    this.resourceService.getResources().subscribe({
      next: (res) => {
        this.resources = res.resources;
        this.loading = false;
      },
      error: () => {
        this.snack.open('Failed to load resources', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    })
  }

  checkAvailability(resourceId: string){
    const date = this.selectedDate.toISOString().split('T')[0];
    this.resourceService.getAvailability(resourceId, date).subscribe({
      next: (res) => {
        this.availability[resourceId] = res.busySlots;
      },
      error: () => {
        this.snack.open('Failed to load availability', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  createBooking(resourceId: string, start: string, end: string){
    this.resourceService
      .createBooking({
        resource_id: resourceId,
        start_time: start,
        end_time: end,
      })
      .subscribe({
        next: () => {
          this.snack.open('Booking request created', 'Close', {
            duration: 3000,
          });
          this.checkAvailability(resourceId);
        },
        error: (error) => {
          this.snack.open(
            error.error?.message || 'Booking failed',
            'Close',
            { duration: 3000}
          );
        },
      });
  }
}

