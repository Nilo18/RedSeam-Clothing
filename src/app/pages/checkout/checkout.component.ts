import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  showSuccess: boolean = false;
  checkoutForm!: FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      zip_code: ['', [Validators.required, Validators.pattern(/^\d+$/)]] // Validate the zip code to be a number
    })
  }

  toggleSuccessMsg(event: boolean) {
    this.showSuccess = event
  }
}
