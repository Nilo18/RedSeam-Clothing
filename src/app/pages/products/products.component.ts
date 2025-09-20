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
  showSort: boolean = false;
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

  // Toggle filter modal
  toggleFilter() {
    this.showFilter = !this.showFilter
    // console.log('Filter flag', this.showFilter)
  }

  // Disable modals when the user clicks somewhere else on the page
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Filter modal
    if (this.showFilter && !target.closest('.products__heading__rightSection__filter') && !target.closest('.filter__modal')) {
      this.showFilter = false;
    }

    // Sort modal
    if (this.showSort && !target.closest('.products__heading__rightSection__sort') && !target.closest('.sort__modal')) {
      this.showSort = false;
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

  // Toggle sort modal
  toggleSort() {
    this.showSort = !this.showSort
    // console.log('Sort flag', this.showSort)
  }

  async sort(by: string) {
    const res = await this.productsService.sortProducts(by);
    this.products = res
  }
}
