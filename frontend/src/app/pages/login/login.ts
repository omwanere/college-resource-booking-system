import { Component } from "@angular/core";
import { NonNullableFormBuilder, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Auth } from "../../services/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  loading = false;
  form!: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private snack: MatSnackBar
  ){
    this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  }

  submit() {
    if(this.form.invalid) return;

    this.loading = true;

    const {email, password} = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.snack.open('Login Successful', 'Close', {duration: 2000});
        const role = this.auth.getUserRole();
        this.router.navigate([role === 'ADMIN' ? '/admin' : '/dashboard']);
      },
      error: (error) => {
        this.snack.open(
          error.error?.message || 'Login Failed',
          'Close',
          {duration: 3000}
        );
        this.loading = false;
      },
    });
  }
}
