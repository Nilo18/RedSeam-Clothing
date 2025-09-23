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
  total: number = 0

  @Output() closeCart = new EventEmitter<boolean>()

  constructor (private cart: CartService) {}

  async ngOnInit() {
    const storedToken = localStorage.getItem('token')
    this.token = storedToken ? JSON.parse(storedToken) : null
    this.cartProducts = await this.cart.getCartItems(this.token)
    console.log('The local cart in cart component is: ', this.cartProducts)
    for (let cartProduct of this.cartProducts) {
      console.log('Cart product prices are: ', cartProduct.price)
      this.total += cartProduct.price
      console.log('The total price is: ', this.total)
    }
  }

  shouldCloseCart() {
    this.closeCart.emit(false)
  }
}
