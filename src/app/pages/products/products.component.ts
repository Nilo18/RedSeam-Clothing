import { Component, HostListener } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';

interface FilterValues {
  from: string,
  to: string
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent {
  products: Product[] = []
  modalIsActive: boolean = false
  showFilter: boolean = false;
  productsAreBeingFetched: boolean = true;
  filterInput: FilterValues = {
    from: '',
    to: ''
  }

  constructor (private productsService: ProductsService) {}

  async ngOnInit() {
    this.products = await this.productsService.getAllProducts('1');
    this.productsAreBeingFetched = false
    console.log('Products inside the ProductComponent: ', this.products)
  }

  toggleFilter() {
    this.showFilter = !this.showFilter
    console.log(this.showFilter)
  }

  @HostListener('document:click', ['$event'])
  disableModal(event: MouseEvent) {
    const target = event.target as HTMLElement

    if (this.showFilter && !target.closest('.products__heading__rightSection__filter') && !target.closest('.filter__modal')) {
      this.showFilter = false;
    }
  }

  async sendFilterReq() {
    try {
      if (this.filterInput.from && this.filterInput.to) {
        console.log(this.filterInput.from, this.filterInput.to)
        const res = await this.productsService.filterProducts(this.filterInput.from, this.filterInput.to);
        this.products = res
      }
    } catch (err) {
        console.log("Couldn't send filter request: ", err)
    }
  }
}
