import { Component, HostListener } from '@angular/core';
import { ProductsService, Product, Meta, FilterValues, PageLink, AppliedFilter } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent {
  products: Product[] = []
  pageIsActive: boolean = false; // Flag to check which page is active
  showFilter: boolean = false; // Flag to control filter modal
  showSort: boolean = false; // Flag to control sort modal
  pageInfo!: Meta;
  pageLinks: PageLink[] = []
  currentPage: string = '1'
  invalidInput: boolean = false // Flag to control filter inputs
  appliedFilters: AppliedFilter[] = [] // Array to keep track and display the applied filters on the page

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
    this.pageInfo = response.meta // This will save page info
    this.pageLinks = response.meta.links
  }

  getNextPage() {
    // Cast the next page into a string so it can be used as a query parameter
    if (this.pageInfo && this.pageInfo?.current_page + 1 < 10) {
      return String(this.pageInfo?.current_page + 1)
    } else {
      // Move back to the first page if the next page exceeds 10
      return String(1)
    }
  }

  getPreviousPage() {
    return String(this.pageInfo.current_page - 1)
  }

  // This is needed to calculate the next page
  getCurrentPageAsNum() {
    if (this.pageInfo?.current_page < 8) {
      return this.pageInfo.current_page
    } else {
      return 7
    }
  }

  calculateNextPage() {
    return String(this.getCurrentPageAsNum() + 1)
  }

  // This is needed to actually get the current page, it is necessary because casting is not allowed directly in the template
  getCurrentPage() {
    return String(this.getCurrentPageAsNum())
  }

  // Toggle filter modal
  toggleFilter() {
    this.showFilter = !this.showFilter
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
      // If the input values are not numbers the request will not be sent
      // This will avoid invalid filter inputs and keep the query strings inside the productsService clean
      const from = Number(this.filterInput.from)
      const to = Number(this.filterInput.to)
      if (this.filterInput.from && this.filterInput.to && !isNaN(from) && !isNaN(to)) {
        const res = await this.productsService.getAllProducts('', this.filterInput.from, this.filterInput.to, '');
        this.products = res.data
        this.pageInfo = res.meta // This will save page info
        this.pageLinks = res.meta.links
        this.applyFilter('Filter', `Price: ${from}-${to}`)
      } else {
        this.invalidInput = true
        setTimeout(() => {
          this.invalidInput = false
        }, 2000)
      }
    } catch (err) {
        console.log("Couldn't send filter request: ", err)
    }
  }

  // Toggle sort modal
  toggleSort() {
    this.showSort = !this.showSort
  }

  applyFilter(key: string, value: string) {
    // Remove the previous sort option first before pushing another
    const previousFilter = this.appliedFilters.findIndex(filter => filter.key === key)
    if (previousFilter !== -1) {
      this.appliedFilters.splice(previousFilter, 1)
    }
    this.appliedFilters.push({key: key, content: value})
  }

  async removeFilter(key: string) {
    const filter = this.appliedFilters.findIndex(filter => filter.key === key)
    if (filter !== -1) {
      this.appliedFilters.splice(filter, 1)
    }

    // Clear the query params depending on the key
    if (key === 'Sort') {
      this.productsService.setSort('') 
    } else if (key === 'Filter') {
      this.productsService.getFilters().from = '' 
      this.productsService.getFilters().to = ''
    }

    const res = await this.productsService.getAllProducts(
      '', this.productsService.getFilters().from, this.productsService.getFilters().to, this.productsService.getSort()
    );
    this.products = res.data
  }

  // Made filterValue optional so that the function is not too dependent on appliedFilters
  async sort(by: string, sortValue?: string) {
    const res = await this.productsService.getAllProducts('', '', '', by);
    this.products = res.data
    this.pageInfo = res.meta // This will save page info
    this.pageLinks = res.meta.links
    if (sortValue) {
      this.applyFilter('Sort', sortValue)
    } 
  }

  async changePage(pageNumber: string) {
    if (Number(pageNumber) <= 0) {
      return
    }
    const response = await this.productsService.getAllProducts(pageNumber)
    this.products = response.data;
    this.productsAreBeingFetched = false
    this.pageInfo = response.meta
    this.pageLinks = response.meta.links
    this.currentPage = pageNumber
  }
}
