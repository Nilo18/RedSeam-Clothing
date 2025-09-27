import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService, CheckoutCredentials } from '../../services/cart.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart-content',
  templateUrl: './cart-content.component.html',
  styleUrl: './cart-content.component.scss'
})
export class CartContentComponent {
  cartProducts: any[] = []
  token!: string
  total: number = 0
  cartIsLoading: boolean = true
  // A flag to control the text content of the 'Go to checkout' button
  // If the user is on the checkout page the button will say 'Pay' instead of 'Go to checkout'
  // It will act differently as well
  @Input() isOnCheckout: boolean = false 
  checkoutButtonMsg: string = 'Go to checkout'
  // A flag to show success message on the checkout page
  @Output() showSuccessMsg = new EventEmitter<boolean>()
  // The checkout form is received from the checkout page and posted to cart/checkout to clear the cart
  @Input() checkoutForm!: FormGroup

  constructor (private cart: CartService) {}

  async ngOnInit() {
    const storedToken = localStorage.getItem('token')
    this.token = storedToken ? JSON.parse(storedToken) : null
    this.cartProducts = await this.cart.getCartItems(this.token)
    this.cartIsLoading = false
    this.calculateTotal()
    if (this.isOnCheckout) {
      this.checkoutButtonMsg = 'Pay'
    }
  }

  emitSuccess() {
    if (this.isOnCheckout) {
      this.showSuccessMsg.emit(true)
    }
  }

  calculateTotal() {
    this.total = 0 // Reset the total before each calculation to prevent it from having stale data
    for (let cartProduct of this.cartProducts) {
        this.total += cartProduct.quantity * cartProduct.price
    }
  }

  async deleteItem(product: number, token: string) {
    // Update the local cart array first so the changes are in live mode
    const index = this.cartProducts.findIndex(prod => prod.id === product)
    this.cartProducts.splice(index, 1)
    // Recalculate the prices
    this.calculateTotal()
    // The cart method handles errors itself so using error handling here isn't 100% necessary
    await this.cart.deleteCartItem(product, token)
  }

  async updateQuantity(product: number, quantity: number, token: string) {
    // Make sure that the quantity doesn't become a negative number
    if (quantity > 0) {
      // Update the local cart array first so the changes are in live mode
      const suggestedProd = this.cartProducts.find(prod => prod.id === product)
      suggestedProd.quantity = quantity
      this.calculateTotal()
      await this.cart.updateItemQuantity(product, quantity, token)
    }
  } 

async clearCartItems() { 
  if (this.isOnCheckout && this.checkoutForm.invalid) {
    this.checkoutForm.markAllAsTouched(); // show all errors
    return;
  }

  if (this.isOnCheckout && !this.checkoutForm.invalid) {
    await this.cart.clearCart(this.checkoutForm, this.token);
    this.emitSuccess();
  }
}
}
