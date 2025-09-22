import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  @Output() closeCart = new EventEmitter<boolean>()

  shouldCloseCart() {
    this.closeCart.emit(false)
  }
}
