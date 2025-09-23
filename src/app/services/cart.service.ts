import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
}
