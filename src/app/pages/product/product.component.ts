import { Component } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  product!: Product
  images: string[] = []

  constructor (private route: ActivatedRoute, private productsService: ProductsService) {}

  async ngOnInit() {  
    const id = this.route.snapshot.paramMap.get('id')
    console.log('Retrieved the id: ', id)
    this.product = await this.productsService.getProductById(Number(id))
    console.log('Received the product in the component: ', this.product)
    this.images = this.product.images
    console.log('The images received from the product: ', this.images)
  }
}
