import { Component } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent {
  products: Product[] = []
  modalIsActive: boolean = false
  showFilter: boolean = false;

  constructor (private productsService: ProductsService) {}

  async ngOnInit() {
    this.products = await this.productsService.getAllProducts('1');
    console.log('Products inside the ProductComponent: ', this.products)
  }

  toggleFilter() {
    this.showFilter = !this.showFilter
    console.log(this.showFilter)
  }
}
