import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, switchMap, takeUntil, tap, map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductsService } from '../../services/products.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product-model';
import { CategoryModel } from '../../models/category-model';
import { FilterType } from 'src/app/shared/enums/filter-type.enum';
import { GenericFilter } from '../../models/filter-types';
import { LandingFooterComponent } from 'src/app/feature/landing/components/landing-footer/landing-footer.component';
import { LandingWelcomeWindowComponent } from 'src/app/feature/landing/components/landing-welcome-window/landing-welcome-window.component';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ProductsFilterComponent } from '../../components/products-filter/products-filter.component';
import { AsyncPipe } from '@angular/common';
import { SafeArrayPipe } from 'src/app/shared/pipes/safeArray.pipe';
import { MatInputModule } from '@angular/material/input';
import { ProductsMockService } from '../../services/mocks/products-mock.service';
import { CategoryMockService } from '../../services/mocks/category-mock.service';
import { TableProductsPaginationComponent } from "../../components/table-products-pagination/table-products-pagination.component";
import { PaginationModel } from 'src/app/shared/models/pagination-model';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  imports: [
    LandingFooterComponent,
    LandingWelcomeWindowComponent,
    ProductsListComponent,
    ProductsFilterComponent,
    AsyncPipe,
    SafeArrayPipe,
    MatFormFieldModule,
    MatInputModule,
    TableProductsPaginationComponent
  ],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  
  isLoading = true; // Add loading state

  constructor(
    private router: Router,
    private productsService: ProductsMockService,
    private categoryService: CategoryMockService
  ) { }

  categoryFilters: any[] = [];

  // Example product filters array: one range filter + one text filter
  productFilters: any[] = [
    {
      label: '',
      type: FilterType.RANGE,
      id: 'price',
      value: [0, 1000000], // Using a large initial range that will be updated with actual product prices
      minRange: 0,
      maxRange: 1000000,
      step: 100,
    },
    {
      label: 'Пошук',
      type: FilterType.STRING,
      id: 'name',
      value: '',
    },
  ];

  paginationFilters = new PaginationModel();

  get availableProductFilters() {
    return this.productFilters.filter((f) => f.label !== 'Пошук');
  }

  // We'll fetch products based on the current query params
  products$ = this.route.queryParams.pipe(
    takeUntil(this.destroy$),
    tap(() => this.isLoading = true),
    switchMap((params) => {
      const queryObj = this.buildQueryObjectFromParams(params);
      return this.productsService.getProducts(queryObj).pipe(
        tap((response: any) => {
          // Update pagination info from response
          if (response.pagination) {
            this.paginationFilters.totalElements = response.pagination.totalElements;
            this.paginationFilters.page = response.pagination.page;
            this.paginationFilters.size = response.pagination.size;
          }
          this.isLoading = false;
        }),
        map(response => response.content || [])
      );
    })
  );

  ngOnInit(): void {
    // 1) Load categories, then map to checkbox filters
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: CategoryModel[]) => {
        // Convert each category to a checkbox filter
        this.categoryFilters = categories.map((cat) => ({
          label: cat.name,
          type: FilterType.CHECKBOX,
          value: false,
          id: cat.id,
        }));

        // 2) Apply current query params to these filters (if any)
        const params = this.route.snapshot.queryParams;
        this.applyQueryParamsToFilters(params);
      });

    // Get all products first to set the max price range
    this.productsService.getProducts()
      .pipe(first())
      .subscribe((response: any) => {
        const products = response.content || [];
        console.log('Initial products for max price:', products.length);
        this.redefineProductsMaxPriceRange(products);
      });
  }

  redefineProductsMaxPriceRange(products: Product[]) {
    if (!products || products.length === 0) return;
    
    // Find the price range filter
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE && f.id === 'price'
    );
    
    if (rangeFilter) {
      // Calculate the minimum and maximum prices from the products
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      // Round down min and up max for cleaner UI
      const roundedMinPrice = Math.floor(minPrice / 100) * 100;
      const roundedMaxPrice = Math.ceil(maxPrice / 100) * 100;
      
      console.log('Price range found:', minPrice, maxPrice, 'Rounded to:', roundedMinPrice, roundedMaxPrice);
      
      // Update the filter's range and value
      rangeFilter.minRange = roundedMinPrice;
      rangeFilter.maxRange = roundedMaxPrice;
      
      // Only set the values if they're not already set by user filters
      const params = this.route.snapshot.queryParams;
      const hasUserPriceFilter = params['price.min'] !== undefined || params['price.max'] !== undefined;
      
      if (!hasUserPriceFilter) {
        rangeFilter.value = [roundedMinPrice, roundedMaxPrice];
      }
    }
  }

  /**
   * Called by <app-products-filter> whenever a single filter changes.
   * We merge this updated filter, then rebuild the query params and navigate.
   */
  onFilterChanged(updatedFilter: GenericFilter): void {
    // 1) Determine which array holds this filter (productFilters or categoryFilters)
    let found = this.productFilters.find((f) => f.label === updatedFilter.label);
    if (found) {
      Object.assign(found, updatedFilter);
    } else {
      // Otherwise, it's a category filter
      found = this.categoryFilters.find((f) => f.label === updatedFilter.label);
      if (found) {
        Object.assign(found, updatedFilter);
      }
    }

    // 2) Build a new queryParams object from the updated filters
    const queryParams = this.buildQueryParamsFromFilters();

    // 3) Update the URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  /**
   * Read the current query params and set the initial states
   * of category filters, range filters, etc. so the UI matches the URL.
   */
  private applyQueryParamsToFilters(params: any): void {
    // Apply category filters
    let categoryIds: string[] = [];
    if (Array.isArray(params['categoriesIds'])) {
      categoryIds = params['categoriesIds'];
    } else if (typeof params['categoriesIds'] === 'string') {
      categoryIds = [params['categoriesIds']];
    }
    
    this.categoryFilters.forEach((filter) => {
      filter.value = categoryIds.includes(filter.id);
    });

    // Apply product filters
    this.productFilters.forEach((filter) => {
      if (filter.type === FilterType.RANGE) {
        const minParam = params[`${filter.id}.min`];
        const maxParam = params[`${filter.id}.max`];
        if (minParam !== undefined && maxParam !== undefined) {
          filter.value = [Number(minParam), Number(maxParam)];
        }
      } else if (filter.type === FilterType.STRING) {
        filter.value = params[filter.id] || '';
      }
    });

    // Apply pagination
    if (params.page) {
      this.paginationFilters.page = Number(params.page);
    }
    if (params.size) {
      this.paginationFilters.size = Number(params.size);
    }
  }

  /**
   * Build a queryParams object from the local filters.
   * Now using priceRange as a single JSON-ified object
   */
  private buildQueryParamsFromFilters(): any {
    const params: any = {};

    // Add category filters
    const selectedCategories = this.categoryFilters
      .filter((f) => f.value === true)
      .map((f) => f.id);
    if (selectedCategories.length > 0) {
      params.categoriesIds = selectedCategories;
    }

    // Add product filters
    this.productFilters.forEach((filter) => {
      if (filter.type === FilterType.RANGE && filter.value) {
        params[`${filter.id}.min`] = filter.value[0];
        params[`${filter.id}.max`] = filter.value[1];
      } else if (filter.type === FilterType.STRING && filter.value) {
        params[filter.id] = filter.value;
      }
    });

    // Add pagination
    if (this.paginationFilters.page) {
      params.page = this.paginationFilters.page;
    }
    if (this.paginationFilters.size) {
      params.size = this.paginationFilters.size;
    }

    return params;
  }

  /**
   * Build a service query object from query params that the productsService expects.
   */
  private buildQueryObjectFromParams(params: any): any {
    // 1) category IDs
    let catIds: string[] = [];
    if (Array.isArray(params['categoriesIds'])) {
      catIds = params['categoriesIds'];
    } else if (typeof params['categoriesIds'] === 'string') {
      catIds = [params['categoriesIds']];
    }

    // 2) Handle price range parameters
    const minPrice = params['price.min'] !== undefined ? Number(params['price.min']) : undefined;
    const maxPrice = params['price.max'] !== undefined ? Number(params['price.max']) : undefined;

    return {
      categoriesIds: catIds,
      name: params['name'] || '',
      'price.min': minPrice,
      'price.max': maxPrice,
      page: params['page'] || 0,
      size: params['size'] || 10
    };
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchFilter = this.productFilters.find(f => f.label === 'Пошук');
    if (searchFilter) {
      searchFilter.value = target.value;
      this.onFilterChanged(searchFilter);
    }
  }

  onPaginationChanged(): void {
    // Update query params with the new pagination
    const queryParams = this.buildQueryParamsFromFilters();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
