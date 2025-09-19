import { Component } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent {
  products: Product[] = []

  constructor (private productsService: ProductsService) {}

  async ngOnInit() {
    this.products = await this.productsService.getAllProducts();
    console.log('Products inside the ProductComponent: ', this.products)
  }
}
