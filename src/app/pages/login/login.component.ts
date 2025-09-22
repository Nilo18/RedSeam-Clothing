import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup
  showPassword: boolean = false;
  gotUnauthErr: boolean = false
  errors: any = {
    emailError: [],
    passwordError: [],
    // unauthError: [] // If the user is unauthenticated (The suggested account hasn't been created yet)
  }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  // Function for resetting the errors array (used when input fields change to prevent retention of stale errors)
  resetErrorArr() {
    this.errors = {
      emailError: [],
      passwordError: [],
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    })

    this.loginForm.valueChanges.subscribe(() => {
      this.resetErrorArr()
      this.gotUnauthErr = false // Reset the flag on input value change to prevent stale errors
    })
  }

  sortErrors(err: any) {
    // Place all possible errors in their respective categories
    // Use ... (spread) operator to avoid nested arrays
    const fields = ['email', 'password'] as const; // Possible categories of errors

    // Separate each field by keys, this is a better approach then pushing each category manually
    fields.forEach(field => {
      const fieldErrors = err.error.errors[field]
      if (fieldErrors?.length) {
        this.errors[`${field}Error`].push(...fieldErrors)
      }
    })
  }

  async onSubmit(credentials: LoginCredentials) {
    try {
      const res = await this.auth.login(credentials)
      if (res.token) {
        this.auth.saveToStorage('token', res.token)
      }

      if (res.user) {
        this.auth.saveToStorage('user', String(res.user))
      }
      this.router.navigate(['/'])
    } catch (err: any) {
      if (err.status === 401) {
        this.gotUnauthErr = true
        // Exit early if the error is unauthenticated, this will prevent sortErrors from receiving undefined values and throwing
        return 
      }
      this.sortErrors(err)
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword
  }
}
