import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResourceService } from '../../services/resource';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
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
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  DatePipe,
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})

export class Resources implements OnInit {
  resources: any[] = [];
  selectedDate: Date = new Date();
  availability: Record<string, any[]> = {};
  loading = false;
  selectedStartTime: string = '09:00';
  selectedEndTime: string = '10:00';
  minDate: Date = new Date();

  
  timeSlots: string[] = [];
  
  constructor(
    private resourceService: ResourceService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ){
    // Generate time slots from 8 AM to 8 PM
    for (let hour = 8; hour <= 20; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      this.timeSlots.push(time);
    }
  }
  
  ngOnInit(){
    this.fetchResources();
  }

  fetchResources(){
    this.loading = true;
    this.cdr.detectChanges(); // Ensure loading state is shown immediately
    this.resourceService.getResources().subscribe({
      next: (res) => {
        console.log('Resources loaded:', res);
        this.resources = res?.resources || res?.resource || [];
        this.loading = false;
        console.log('Resources array:', this.resources);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading resources:', error);
        this.snack.open('Failed to load resources', 'Close', {
          duration: 3000,
        });
        this.resources = [];
        this.loading = false;
        this.cdr.markForCheck();
      },
    })
  }

  checkAvailability(resourceId: string){
    const date = this.selectedDate.toISOString().split('T')[0];
    this.resourceService.getAvailability(resourceId, date).subscribe({
      next: (res) => {
        this.availability[resourceId] = res.busySlots || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open('Failed to load availability', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  createBooking(resourceId: string){
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    const startDateTime = `${dateStr} ${this.selectedStartTime}:00`;
    const endDateTime = `${dateStr} ${this.selectedEndTime}:00`;
    
    // Validate time selection
    if (this.selectedStartTime >= this.selectedEndTime) {
      this.snack.open('End time must be after start time', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.resourceService
      .createBooking({
        resource_id: resourceId,
        start_time: startDateTime,
        end_time: endDateTime,
      })
      .subscribe({
        next: () => {
          this.snack.open('Booking request created', 'Close', {
            duration: 3000,
          });
          this.checkAvailability(resourceId);
          this.cdr.detectChanges();
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

