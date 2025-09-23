import { Component } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ColorsService } from '../../services/colors.service';
import { CartService, ProductProperties } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  product!: Product
  images: string[] = []
  possibleColors: { [key: string]: string } = {}
  showCart: boolean = false
  token!: string
  productProperties = {
    color: 'Blue',
    quantity: 1,
    size: 'XL'
  }

  constructor (private route: ActivatedRoute, private productsService: ProductsService, 
    private colors: ColorsService, private cart: CartService) {}

  async ngOnInit() {  
    const id = this.route.snapshot.paramMap.get('id')
    console.log('Retrieved the id: ', id)
    this.product = await this.productsService.getProductById(Number(id))
    console.log('Received the product in the component: ', this.product)
    this.images = this.product.images
    console.log('The images received from the product: ', this.images)
    this.possibleColors = this.colors.getColorHexMap()
    console.log('The possible colors are: ', this.possibleColors)
    const storedToken = localStorage.getItem('token')
    this.token = storedToken ? JSON.parse(storedToken) : null
    console.log('Successfully retrieved the token on product page: ', this.token)
  }

  setCartVisibility(val: boolean) {
    this.showCart = val
    console.log(this.showCart)
  }

  async add(product: number, productProps: ProductProperties, token: string) {
    await this.cart.addToCart(product, productProps, token)
  }
}
