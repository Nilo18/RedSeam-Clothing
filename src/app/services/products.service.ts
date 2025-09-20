import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface Brand {
  id: number,
  name: string,
  image: string
}

interface Links {
  first: string,
  last: string,
  next: string,
  prev: string
}

interface PageLink {
  url: string,
  label: string,
  active: boolean
}

interface Meta {
  current_page: number,
  from: number,
  last_page: number,
  links: PageLink[],
  path: string,
  per_page: number,
  to: number,
  total: number
}

export interface Product {
  cover_image: string,
  description: string,
  id: number,
  images: string[],
  name: string,
  price: string,
  quanitity: number,
  release_date: string,
  total_price: number
  available_colors?: string,
  available_sizes?: string,
  color?: string,
  size?: string,
  brand?: Brand
}

interface ProductsResponse {
  data: Product[],
  links: Links,
  meta: Meta
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsURL = 'https://api.redseam.redberryinternship.ge/api/products'

  constructor(private http: HttpClient) { }

  async getAllProducts(page: string) {
    try {
      const res = await firstValueFrom(this.http.get<ProductsResponse>(`${this.productsURL}?page=${page}`))
      console.log(res)
      return res.data
    } catch (err) {
      console.log("Couldn't get all the products: ", err)
      throw err
    }
  }
}
