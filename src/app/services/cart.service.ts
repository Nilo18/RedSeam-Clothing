import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { Product } from './products.service';

export interface ProductProperties {
  color: string,
  quantity: number,
  size: string
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartURL ='https://api.redseam.redberryinternship.ge/api/cart'
  private productsSubject = new BehaviorSubject<any[]>([])

  constructor(private http: HttpClient) { }

  async addToCart(product: number, productProps: ProductProperties, token: string) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.cartURL}/products/${product}`, productProps, {headers: {
        Authorization: `Bearer ${token}`
       }}))
       console.log('Successfully added to the card, the response is: ', res)
    } catch (err) {
      console.log("Couldn't add to cart: ", err)
      throw err
    }
  }

  async getCartItems(token: string) {
    try {
      const res = await firstValueFrom(this.http.get<any>(this.cartURL, {headers: {
        Authorization: `Bearer ${token}`
      }}))
      console.log("The cart items are: ", res)
      return res
    } catch (err) {
      console.log("Couldn't get cart items: ", err)
      throw err
    }
  }

  async deleteCartItem(product: number, token: string) {
    try {
      const res = await firstValueFrom(this.http.delete(`${this.cartURL}/products/${product}`, {headers: {
        Authorization: `Bearer ${token}`
      }}))
      console.log(res)
    } catch (err) {
      console.log("Couldn't delete cart item: ", err)
      throw err
    }
  }

  async updateItemQuantity(product: number, quantity: number, token: string) {
    try {
      // Pass quantity with {} because the the backend expects an object
      const res = await firstValueFrom(this.http.patch(`${this.cartURL}/products/${product}`, {quantity}, {headers: {
        Authorization: `Bearer ${token}`
      }}))
      console.log('The updated item: ', res)
    } catch (err) {
      console.log("Couldn't update quantity: ", err)
      throw err
    }
  }
}
