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
  addedToCart: boolean = false // Flag to display a message when a product is added to cart
  token!: string
  productProperties: ProductProperties = {
    color: 'Default',
    quantity: 1,
    size: 'M'
  }

  constructor (private route: ActivatedRoute, private productsService: ProductsService, 
    private colors: ColorsService, private cart: CartService) {}

  async ngOnInit() {  
    const id = this.route.snapshot.paramMap.get('id')
    console.log('Retrieved the id: ', id)
    this.product = await this.productsService.getProductById(Number(id))
    this.productProperties.color = this.product.color ? this.product.color : 'Default' 
    this.productProperties.size = this.product.size ? this.product.size : 'M'
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
    console.log('The product properties are: ', this.productProperties)
    const res = await this.cart.addToCart(product, productProps, token)
    this.addedToCart = res ? true : false // Make the successful addition message appear based on the condition
    // Remove the message after 2 seconds
    setTimeout(() => {
      this.addedToCart = false
    }, 2000)
  }
  
}
