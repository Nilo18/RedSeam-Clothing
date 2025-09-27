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

  @Output() closeCart = new EventEmitter<boolean>()

  constructor (private cart: CartService) {}

  async ngOnInit() {
    // Only receive the cart to calculate it's size and display it in the header
    const storedToken = localStorage.getItem('token')
    this.token = storedToken ? JSON.parse(storedToken) : null
    this.cartProducts = await this.cart.getCartItems(this.token)
  }

  shouldCloseCart() {
    this.closeCart.emit(false)
  }
}
