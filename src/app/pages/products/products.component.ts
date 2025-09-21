import { Component, HostListener } from '@angular/core';
import { ProductsService, Product, Meta, ProductsResponse, FilterValues } from '../../services/products.service';

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
  pageInfo!: Meta;
  productsAreBeingFetched: boolean = true;
  filterInput: FilterValues = {
    from: '',
    to: ''
  }

  constructor (private productsService: ProductsService) {}

  async ngOnInit() {
    const response = await this.productsService.getAllProducts('1')
    this.products = response.data; // This will save the products
    this.productsAreBeingFetched = false
    console.log('Products inside the ProductComponent: ', this.products)
    this.pageInfo = response.meta // This will save page info
    console.log(this.pageInfo)
    console.log('The next page is: ', this.getNextPage())
  }

  getNextPage() {
    // Cast the next page into a string so it can be used as a query parameter
    if (this.pageInfo && this.pageInfo.current_page + 1 < 10) {
      return String(this.pageInfo.current_page + 1)
    } else {
      // Move back to the first page if the next page exceeds 10
      return String(1)
    }
  }

  getPreviousPage() {
    return String(this.pageInfo.current_page - 1)
  }

  getCurrentPage() {
    console.log(this.pageInfo.current_page)
    if (this.pageInfo.current_page < 8) {
      return String(this.pageInfo.current_page)
    } else {
      return String(1)
    }
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
        const res = await this.productsService.getAllProducts('', this.filterInput.from, this.filterInput.to, '');
        this.products = res.data
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
    const res = await this.productsService.getAllProducts('', '', '', by);
    this.products = res.data
  }

  async changePage(pageNumber: string) {
    const response = await this.productsService.getAllProducts(pageNumber)
    this.products = response.data;
    this.productsAreBeingFetched = false
    this.pageInfo = response.meta
    console.log('The next page is: ', this.getNextPage())
  }
}
