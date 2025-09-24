import { Component, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartProducts: any[] = []
  token!: string
  // total: number = 0
  // cartIsLoading: boolean = true

  @Output() closeCart = new EventEmitter<boolean>()

  constructor (private cart: CartService) {}

  async ngOnInit() {
    // Only receive the cart to calculate it's size and display it in the header
    const storedToken = localStorage.getItem('token')
    this.token = storedToken ? JSON.parse(storedToken) : null
    this.cartProducts = await this.cart.getCartItems(this.token)
    // this.cartIsLoading = false
    console.log('The local cart in cart component is: ', this.cartProducts)
    // this.calculateTotal()
  }

  // calculateTotal() {
  //     for (let cartProduct of this.cartProducts) {
  //     console.log('Cart product prices are: ', cartProduct.price)
  //     this.total += cartProduct.quantity * cartProduct.price
  //     console.log('The total price is: ', this.total)
  //   }
  // }

  shouldCloseCart() {
    this.closeCart.emit(false)
  }

  // async deleteItem(product: number, token: string) {
  //   // Update the local cart array first so the changes are in live mode
  //   const index = this.cartProducts.findIndex(prod => prod.id === product)
  //   this.cartProducts.splice(index, 1)
  //   // Recalculate the prices
  //   this.calculateTotal()
  //   // The cart method handles errors itself so using error handling here isn't 100% necessary
  //   await this.cart.deleteCartItem(product, token)
  // }

  // async updateQuantity(product: number, quantity: number, token: string) {
  //   // Make sure that the quantity doesn't become a negative number
  //   if (quantity > 0) {
  //     console.log(`The id is: ${product}`, `The suggested new quantity is: ${quantity}`, `The token is: ${token}`)
  //     // Update the local cart array first so the changes are in live mode
  //     const suggestedProd = this.cartProducts.find(prod => prod.id === product)
  //     suggestedProd.quantity = quantity
  //     this.calculateTotal()
  //     await this.cart.updateItemQuantity(product, quantity, token)
  //   }
  // } 
}
