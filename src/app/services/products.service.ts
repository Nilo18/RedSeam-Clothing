import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';

export interface Brand {
  id: number,
  name: string,
  image: string
}

export interface Links {
  first: string,
  last: string,
  next: string,
  prev: string
}

export interface PageLink {
  url: string,
  label: string,
  active: boolean
}

export interface Meta {
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

export interface ProductsResponse {
  data: Product[],
  links: Links,
  meta: Meta
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsURL = 'https://api.redseam.redberryinternship.ge/api/products'
  // private productsResponse!: ProductsResponse
  // private currentPage: number = 0

  constructor(private http: HttpClient) { }

  async getAllProducts(page: string) {
    try {
      const res = await firstValueFrom(this.http.get<ProductsResponse>(`${this.productsURL}?page=${page}`))
      // this.currentPage = res.meta.current_page
      // this.productsResponse = res
      console.log(res)
      // console.log('Local copy of products response: ', this.productsResponse)
      return res
    } catch (err) {
      console.log("Couldn't get all the products: ", err)
      throw err
    }
  }

  async filterProducts(from: string, to: string) {
    try {
      const res = 
      await firstValueFrom(this.http.get<ProductsResponse>(`${this.productsURL}?filter[price_from]=${from}&filter[price_to]=${to}`))
      console.log(res)
      return res.data
    } catch (err) {
      console.log("Couldn't filter: ", err)
      throw err
    }
  }

  async sortProducts(by: string) {
    try {
      const res = await firstValueFrom(this.http.get<ProductsResponse>(`${this.productsURL}?sort=${by}`))
      console.log(res)
      return res.data
    } catch (err) {
      console.log("Couldn't sort: ", err)
      throw err
    }
  }
}
