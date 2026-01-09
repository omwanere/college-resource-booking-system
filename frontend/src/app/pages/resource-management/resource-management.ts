import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource';

@Component({
  selector: 'app-resource-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './resource-management.html',
  styleUrl: './resource-management.scss',
})
export class ResourceManagementComponent implements OnInit {
  resources: any[] = [];
  loading = false;
  form!: FormGroup;
  editingResource: any = null;
  showForm = false;

  resourceTypes = ['Room', 'Lab', 'Equipment', 'Hall', 'Other'];

  constructor(
    private resourceService: ResourceService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      capacity: [''],
      location: [''],
    });
  }

  ngOnInit() {
    this.fetchResources();
  }

  fetchResources() {
    this.loading = true;
    this.resourceService.getResources().subscribe({
      next: (res) => {
        this.resources = res.resources || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open('Failed to load resources', 'Close', {
          duration: 3000,
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openAddForm() {
    this.editingResource = null;
    this.form.reset();
    this.showForm = true;
  }

  editResource(resource: any) {
    this.editingResource = resource;
    this.form.patchValue({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity || '',
      location: resource.location || '',
    });
    this.showForm = true;
  }

  cancelEdit() {
    this.showForm = false;
    this.editingResource = null;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.snack.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    const formData = this.form.value;
    
    if (this.editingResource) {
      // Update existing resource
      this.resourceService
        .updateResource(this.editingResource.id, formData)
        .subscribe({
          next: () => {
            this.snack.open('Resource updated successfully', 'Close', {
              duration: 2000,
            });
            this.fetchResources();
            this.cancelEdit();
          },
          error: (error) => {
            this.snack.open(
              error.error?.message || 'Failed to update resource',
              'Close',
              { duration: 3000 }
            );
          },
        });
    } else {
      // Create new resource
      this.resourceService.createResource(formData).subscribe({
        next: () => {
          this.snack.open('Resource created successfully', 'Close', {
            duration: 2000,
          });
          this.fetchResources();
          this.cancelEdit();
        },
        error: (error) => {
          this.snack.open(
            error.error?.message || 'Failed to create resource',
            'Close',
            { duration: 3000 }
          );
        },
      });
    }
  }

  deleteResource(id: string) {
    if (confirm('Are you sure you want to disable this resource?')) {
      this.resourceService.disableResource(id).subscribe({
        next: () => {
          this.snack.open('Resource disabled successfully', 'Close', {
            duration: 2000,
          });
          this.fetchResources();
        },
        error: (error) => {
          this.snack.open(
            error.error?.message || 'Failed to disable resource',
            'Close',
            { duration: 3000 }
          );
        },
      });
    }
  }
}
