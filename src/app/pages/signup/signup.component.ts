import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup
  selectedFile?: File
  imagePreview?: string
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errors: any = {
    emailError: [],
    usernameError: [],
    passwordError: [],
    confirmPasswordError: [],
    avatarError: []
  }
  
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {}

  // Function for resetting the errors array (used when input fields change to prevent retention of stale errors)
  resetErrorArr() {
    this.errors = {
      emailError: [],
      usernameError: [],
      passwordError: [],
      confirmPasswordError: [],
      avatarError: []
    }
  }

  // For image uploads
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.selectedFile = input.files[0]
      console.log(input.files[0].type)
      console.log(this.selectedFile)
      console.log(this.selectedFile.name, this.selectedFile.type, this.selectedFile.size)

      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result as string
      }
      reader.readAsDataURL(this.selectedFile)

      this.resetErrorArr() 
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>

  // For Remove button
  removeFile() {
    this.selectedFile = undefined
    this.imagePreview = undefined

    const input = this.fileInput.nativeElement
    input.value = ''
  }

  ngOnInit() {
    // No validators needed because backend already validates the requests
    this.signupForm = this.fb.group({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    // Reset the errors on field value changes
    // This will prevent stale errors from messing up error array indexing
    this.signupForm.valueChanges.subscribe(() => {
      this.resetErrorArr()
    })
  }

  // For showing password field as text/hashed
  toggleShowPassword() {
    this.showPassword = !this.showPassword
  }

  // For showing confirm password field as text/hashed
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  // Method to append to form data
  appendToFormData() {
    const formData = new FormData()
    // Append form values to form-data to allow images to be sent
    formData.append('username', this.signupForm.value.username)
    formData.append('email', this.signupForm.value.email)
    formData.append('password', this.signupForm.value.password)
    formData.append('password_confirmation', this.signupForm.value.confirmPassword)

    // Append the image only if it is valid
    if (this.selectedFile) {
      console.log(this.selectedFile)
      formData.append('avatar', this.selectedFile)
    }

    return formData
  }

  sortErrors(err: any) {
    // Place all possible errors in their respective categories
    // Use ... (spread) operator to avoid nested arrays
    const fields = ['username', 'email', 'password', 'avatar'] as const; // Possible categories of errors

    // Separate each field by keys, this is a better approach then pushing each category manually
    fields.forEach(field => {
      const fieldErrors = err.error.errors[field];
      if (fieldErrors?.length) {
        this.errors[`${field}Error`].push(...fieldErrors);
      }
    });
  }

  separateConfirmPasswordError(err: any) {
    // Check if the user got password confirmation error
    const confirmError = err.error.errors.password.find((msg: string) => msg.toLowerCase().includes('confirm'))
    if (confirmError) {
      // If they did, move them into confirmPasswordError 
      this.errors.confirmPasswordError.push(confirmError)
      this.errors.passwordError = this.errors.passwordError.flat().filter((msg: string) => !msg.toLowerCase().includes('confirm'));
    }
  }

  async onSubmit() {
    const formData = this.appendToFormData()
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const res = await this.auth.signup(formData)
      if (res.token) {
        this.auth.saveToStorage('token', res.token)
      }

      if (res.user) {
        this.auth.saveToStorage('user', res.user)
      }

      this.router.navigate(['/'])
    } catch (err: any) {
      this.sortErrors(err)
      this.separateConfirmPasswordError(err); 
    }

  }
}
