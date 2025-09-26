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

export interface FilterValues {
  from?: string,
  to?: string
}

export interface AppliedFilter {
  key: string,
  content: string
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsURL: string = 'https://api.redseam.redberryinternship.ge/api/products'
  private filters: FilterValues = {}
  private sortBy?: string
  private page?: string

  constructor(private http: HttpClient) { }

  getFilters() {
    return this.filters
  }

  getSort() {
    // if (this.sortBy) {
      return this.sortBy
    // }
  }

  setSort(value: string) {
    this.sortBy = value;
  }

  // Use one method for fetching products, this will allow sort and filter chaining
  async getAllProducts(page?: string, from?: string, to?: string, by?: string) {
    try {
      // Save the filtering options if they're being passed
      if (from && to) {
        this.filters.from = from;
        this.filters.to = to;
      }

      // Same goes for the sorting options
      if (by) { 
        this.sortBy = by; 
      }

      // And the page options
      if (page) {
        this.page = page;
      } 

      // An array to keep track of the query parameters
      const queryParts: string[] = []

      // Store the query strings in a Record to map them to each other, this is better than using multiple if statements
      const queryMap: Record<string, string | undefined> = {
        page: this.page,
        'filter[price_from]': this.filters.from,
        'filter[price_to]': this.filters.to,
        sort: this.sortBy,
      };

      // Now iterate over the Record and construct query parameters
      for (const [key, value] of Object.entries(queryMap)) {
        if (value) queryParts.push(`${key}=${value}`);
      }

      // Join the parameters with & to complete the construction
      const query = queryParts.join('&')
      // Send the request with the built query
      console.log(query)
      const res = await firstValueFrom(this.http.get<ProductsResponse>(`${this.productsURL}?${query}`))
      console.log(res)
      return res
    } catch (err) {
      console.log("Couldn't get all the products: ", err)
      throw err
    }
  }

  async getProductById(id: number) {
    try {
      const res = await firstValueFrom(this.http.get<Product>(`${this.productsURL}/${id}`))
      console.log('The found product is: ', res)
      return res
    } catch (err) {
      console.log("Couldn't get product by id: ", err)
      throw err
    }
  }
}
