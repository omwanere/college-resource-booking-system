import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './register.html',
})

export class RegisterComponent {
  loading = false;
  form! : FormGroup
  

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private snack: MatSnackBar
  ){
    this.form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  }

  submit(){
    if(this.form.invalid) return;
    this.loading = true;
    this.auth
      .register({
        ...this.form.value,
        role: 'USER',
      } as any)
      .subscribe({
        next: () => {
          this.snack.open('Registation successful', 'Close', {
            duration: 2000,
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.snack.open(
            error.error?.message || 'Registration failed',
            'Close', 
            {
              duration: 3000
            }
          );
          this.loading = false;
        },
      });
  }
}
