import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '../services/cart.service';

export const checkoutGuard: CanActivateFn = async (route, state) => {
  const storedToken = localStorage.getItem('token')
  const token = storedToken ? JSON.parse(storedToken) : null
  const router = inject(Router)
  const cartService = inject(CartService)
  const cart = await cartService.getCartItems(token)

  // If the cart is empty or the the user is unauthorized, do not let them into the checkout page
  if (!token || cart.length === 0) {
    return router.parseUrl('/')
  }

  return true;
};
