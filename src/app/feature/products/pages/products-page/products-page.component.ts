import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, switchMap, takeUntil, tap, map, distinctUntilChanged, debounceTime, skip, Observable, of, catchError, finalize } from 'rxjs';
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
import { TableProductsPaginationComponent } from "../../components/table-products-pagination/table-products-pagination.component";
import { PaginationModel } from 'src/app/shared/models/pagination-model';
import { ProductsResponse } from '../../services/products.service';

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
  private productsSubject = new Subject<{ queryObj: any, forceRefresh?: boolean }>();
  private lastQueryString: string | null = null;
  private isInitialLoad = true;
  private filtersInitialized = false;
  private categoriesLoaded = false;
  
  // Keep track of global price range
  private globalPriceRange = {
    min: 0,
    max: 1000000
  };
  
  isLoading = true; // Add loading state
  products: Product[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoryService: CategoryService
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

  // Check if this is a category being deselected
  private isCategoryBeingDeselected(queryObj: any): boolean {
    if (!this.lastQueryString) return false;
    
    const prevQueryObj = JSON.parse(this.lastQueryString || '{}');
    const wasCategorySelected = prevQueryObj?.categoriesIds?.length > 0;
    const isCategoryDeselected = wasCategorySelected && 
                              (!queryObj.categoriesIds || queryObj.categoriesIds.length === 0);
    
    return isCategoryDeselected;
  }

  // We'll create a products$ observable that handles duplicate requests
  products$ = this.productsSubject.pipe(
    takeUntil(this.destroy$),
    distinctUntilChanged((prev, curr) => {
      if (curr.forceRefresh) return false; // Always proceed if force refresh
      
      const prevString = JSON.stringify(prev.queryObj);
      const currString = JSON.stringify(curr.queryObj);
      return prevString === currString;
    }),
    switchMap(({ queryObj, forceRefresh }) => {
      // Check if this is a category being deselected
      const isCategoryDeselected = this.isCategoryBeingDeselected(queryObj);
      
      // Deduplicate identical queries
      const queryString = JSON.stringify(queryObj);
      if (queryString === this.lastQueryString && !this.isInitialLoad && !forceRefresh && !isCategoryDeselected) {
        return of(this.products); // Return current products
      }
      
      this.lastQueryString = queryString;
      this.isInitialLoad = false;
      this.isLoading = true;
      
      // If user deselected a category, reset price filters to global range
      // and remove price range from URL
      if (isCategoryDeselected) {
        // Create a clean query without price range filters
        const cleanQuery = { ...queryObj };
        delete cleanQuery['priceRange.min'];
        delete cleanQuery['priceRange.max'];
        
        // Update the query object for this request
        queryObj = cleanQuery;
        
        // Update the URL without triggering navigation
        const queryParams = { ...this.route.snapshot.queryParams };
        delete queryParams['priceRange.min'];
        delete queryParams['priceRange.max'];
        
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          replaceUrl: true
        });
        
        // Reset the filter in the UI
        this.resetPriceFilterToGlobalRange(false); // Don't force refresh here
      }
      
      // Ensure size is always 20
      if (!queryObj.size || queryObj.size !== 20) {
        queryObj.size = 20;
      }
      
      return this.productsService.getProducts(queryObj).pipe(
        tap((response: any) => {
          // Update price range from response if available, but only if this is
          // an unfiltered request or the initial load or force refresh or category deselection
          if (response.priceRange && !(response.priceRange.min === 0 && response.priceRange.max === 0)) {
            // Check if this is an unfiltered request (no price range filters)
            const isUnfilteredRequest = !queryObj['priceRange.min'] && !queryObj['priceRange.max'];
            
            if (isUnfilteredRequest || this.isInitialLoad || forceRefresh || isCategoryDeselected) {
              // Update the global price range for unfiltered requests
              this.globalPriceRange = {
                min: response.priceRange.min,
                max: response.priceRange.max
              };
              this.updatePriceFilter(response.priceRange.min, response.priceRange.max);
            } else {
              // For filtered requests, use the existing global range for min/max
              // but respect user's current selected values
              this.preserveUserPriceFilter(response.priceRange);
            }
          } else if (response.content && response.content.length === 0) {
            // If category has no products, keep the global price range
            console.log('Empty category selected, maintaining global price range');
          }
          
          // Update pagination info from response, but keep size fixed at 20
          this.paginationFilters.totalElements = response.totalElements || 0;
          this.paginationFilters.page = response.number || 0;
          // Do not update size from response - always keep it at 20
          
          // Extract products from response
          if (Array.isArray(response.content)) {
            this.products = response.content;
          } else {
            this.products = []; // Reset products if invalid data
          }
          
          this.isLoading = false;
        }),
        map(response => {
          if (Array.isArray(response.content)) {
            return response.content;
          }
          return [];
        }),
        catchError(error => {
          this.isLoading = false;
          this.products = [];
          return of([]);
        })
      );
    })
  );

  ngOnInit(): void {
    // Set default page size to 20
    this.paginationFilters.size = 20;

    // Subscribe to our products$ observable first to ensure it's ready
    const productsSubscription = this.products$.subscribe();
    this.filtersInitialized = false;

    // Get the current route params before making any API calls
    const routeParams = this.route.snapshot.queryParams;
    const hasQueryParams = Object.keys(routeParams).length > 0;

    // 1) Load categories FIRST, since we need them before we can properly apply filters
    this.categoryService
      .getCategories()
      .pipe(
        takeUntil(this.destroy$),
        // Ensure we complete this step before proceeding
        finalize(() => {
          this.categoriesLoaded = true;
          this.loadProductsAfterInitialization(routeParams, hasQueryParams);
        })
      )
      .subscribe((categories: CategoryModel[]) => {
        // Convert each category to a checkbox filter
        this.categoryFilters = categories.map((cat) => ({
          label: cat.name,
          type: FilterType.CHECKBOX,
          value: false,
          id: cat.id,
        }));

        // Apply current query params to these filters
        this.applyQueryParamsToFilters(routeParams);
      });

    // 2) Set up query param subscription AFTER initial load is complete
    // This handles navigation changes AFTER the component is initialized
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        // Skip the first emission which is handled separately
        skip(1)
      )
      .subscribe(params => {
        // This only runs for subsequent URL changes
        const queryObj = this.buildQueryObjectFromParams(params);
        this.productsSubject.next({ queryObj });
      });
  }
  
  // This method ensures proper load sequence after initialization
  private loadProductsAfterInitialization(params: any, hasQueryParams: boolean): void {
    // Mark filters as initialized to prevent parallel loading
    this.filtersInitialized = true;
    
    // Build query object from the current params
    const queryObj = this.buildQueryObjectFromParams(params);
    
    // Check if we have price range parameters
    const hasPriceRange = params['priceRange.min'] !== undefined || params['priceRange.max'] !== undefined;
    
    // If we have query params, use those filters, otherwise do a general load
    if (hasQueryParams) {
      // For routes with params, use the filtered query
      this.productsSubject.next({ 
        queryObj, 
        // Force refresh when there's a price range to ensure API returns correct price range
        forceRefresh: hasPriceRange 
      });
    } else {
      // For empty routes, do a general load
      const emptyQuery = {
        categoriesIds: [],
        name: '',
        page: 0,
        size: 20
      };
      // Always force refresh on initial load to get correct price ranges
      this.productsSubject.next({ queryObj: emptyQuery, forceRefresh: true });
    }
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
      
      this.updatePriceRangeFilter(minPrice, maxPrice);
    }
  }

  private updatePriceRangeFilter(minPrice: number, maxPrice: number) {
    // Find the price range filter
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE && f.id === 'price'
    );
    
    if (rangeFilter) {
      // Get current user parameters
      const params = this.route.snapshot.queryParams;
      const hasUserPriceFilter = params['priceRange.min'] !== undefined || params['priceRange.max'] !== undefined;
      
      // Round down min and up max for cleaner UI
      const roundedMinPrice = Math.floor(minPrice / 100) * 100;
      const roundedMaxPrice = Math.ceil(maxPrice / 100) * 100;
      
      // Only update the slider range constraints if this is the initial load 
      // or if there's no active price filter from the user
      if (!hasUserPriceFilter || this.isInitialLoad) {
        // Update the range constraints to reflect the full range of available products
        rangeFilter.minRange = roundedMinPrice;
        rangeFilter.maxRange = roundedMaxPrice;
        
        // Set initial values too if no user filter exists
        rangeFilter.value = [roundedMinPrice, roundedMaxPrice];
      } else {
        // If user has an active filter, keep their min value
        // but ensure max value doesn't exceed the actual maximum
        const currentValue = [...rangeFilter.value];
        
        // If max exceeds available max, cap it
        if (currentValue[1] > roundedMaxPrice) {
          currentValue[1] = roundedMaxPrice;
          rangeFilter.value = currentValue;
        }
        
        // Don't update minRange/maxRange when filtering is active
        // This preserves the slider's full range
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

    // 3) Update the URL with replaceUrl to prevent adding to browser history
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true // Replace current URL instead of pushing to history
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
        const minParam = params[`priceRange.min`];
        const maxParam = params[`priceRange.max`];
        if (minParam !== undefined && maxParam !== undefined) {
          // Set value from URL params
          filter.value = [Number(minParam), Number(maxParam)];
          
          // Temporarily set the min/max range to match the values
          // This prevents the slider from showing a giant range while loading
          if (Number(minParam) < Number(maxParam)) {
            // Only update ranges if values make sense
            const bufferAmount = Math.ceil((Number(maxParam) - Number(minParam)) * 0.1); // 10% buffer
            filter.minRange = Math.max(0, Number(minParam) - bufferAmount);
            filter.maxRange = Number(maxParam) + bufferAmount;
            
            // Also update the global range temporarily
            this.globalPriceRange.min = filter.minRange;
            this.globalPriceRange.max = filter.maxRange;
          }
        }
      } else if (filter.type === FilterType.STRING) {
        filter.value = params[filter.id] || '';
      }
    });

    // Apply pagination
    if (params.page) {
      this.paginationFilters.page = Number(params.page);
    }
    
    // Always set fixed size of 20, regardless of URL parameters
    this.paginationFilters.size = 20;
  }

  /**
   * Build a queryParams object from the local filters.
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
        params[`priceRange.min`] = filter.value[0];
        params[`priceRange.max`] = filter.value[1];
      } else if (filter.type === FilterType.STRING && filter.value) {
        params[filter.id] = filter.value;
      }
    });

    // Add pagination - always use page from pagination filters but fixed size of 20
    if (this.paginationFilters.page) {
      params.page = this.paginationFilters.page;
    }
    
    // Always use fixed size of 20
    params.size = 20;

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
    const minPrice = params['priceRange.min'] !== undefined ? Number(params['priceRange.min']) : undefined;
    const maxPrice = params['priceRange.max'] !== undefined ? Number(params['priceRange.max']) : undefined;

    return {
      categoriesIds: catIds,
      name: params['name'] || '',
      'priceRange.min': minPrice,
      'priceRange.max': maxPrice,
      page: params['page'] || 0,
      size: 20 // Always use fixed size of 20
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
      replaceUrl: true // Replace current URL instead of pushing to history
    });
  }

  // Force a refresh by passing forceRefresh: true
  forceRefresh(): void {
    const queryObj = this.buildQueryObjectFromParams(this.route.snapshot.queryParams);
    this.productsSubject.next({ queryObj, forceRefresh: true });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // New helper method to preserve user's price filter while respecting global range
  private preserveUserPriceFilter(currentRangeFromApi: { min: number, max: number }) {
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE && f.id === 'price'
    );
    
    if (rangeFilter) {
      // Get current user values
      const params = this.route.snapshot.queryParams;
      const userMinPrice = params['priceRange.min'] !== undefined ? Number(params['priceRange.min']) : null;
      const userMaxPrice = params['priceRange.max'] !== undefined ? Number(params['priceRange.max']) : null;
      
      // Preserve the user's filter values
      if (userMinPrice !== null && userMaxPrice !== null) {
        rangeFilter.value = [userMinPrice, userMaxPrice];
      }
      
      // Ensure the slider range (min/max constraints) stays set to the global range
      // This prevents the slider from shrinking when filtered results come back
      rangeFilter.minRange = this.globalPriceRange.min;
      rangeFilter.maxRange = this.globalPriceRange.max;
    }
  }
  
  // Replace the old updatePriceRangeFilter with this new method
  private updatePriceFilter(minPrice: number, maxPrice: number) {
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE && f.id === 'price'
    );
    
    if (rangeFilter) {
      // Ignore invalid price ranges (where both min and max are 0, which happens with empty categories)
      if (minPrice === 0 && maxPrice === 0) {
        return;
      }

      // Round down min and up max for cleaner UI
      const roundedMinPrice = Math.floor(minPrice / 100) * 100;
      const roundedMaxPrice = Math.ceil(maxPrice / 100) * 100;
      
      // Set the range constraints to reflect the full range of available products
      rangeFilter.minRange = roundedMinPrice;
      rangeFilter.maxRange = roundedMaxPrice;
      
      // Update the global price range as well
      this.globalPriceRange.min = roundedMinPrice;
      this.globalPriceRange.max = roundedMaxPrice;
      
      // Get current user parameters
      const params = this.route.snapshot.queryParams;
      const hasUserPriceFilter = params['priceRange.min'] !== undefined || params['priceRange.max'] !== undefined;
      
      // Only set values if no user filter exists
      if (!hasUserPriceFilter) {
        rangeFilter.value = [roundedMinPrice, roundedMaxPrice];
      }
    }
  }

  // Add a method to reset price filter to global range
  private resetPriceFilterToGlobalRange(shouldForceRefresh: boolean = true): void {
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE && f.id === 'price'
    );
    
    if (rangeFilter) {
      // Check if we have valid global price range
      if (this.globalPriceRange.max > 0 && this.globalPriceRange.min < this.globalPriceRange.max) {
        // Reset to the global range
        rangeFilter.minRange = this.globalPriceRange.min;
        rangeFilter.maxRange = this.globalPriceRange.max;
        rangeFilter.value = [this.globalPriceRange.min, this.globalPriceRange.max];
      } else {
        // If no valid global range exists yet (empty category case), 
        // use default values and force a refresh
        rangeFilter.minRange = 0;
        rangeFilter.maxRange = 1000000;
        rangeFilter.value = [0, 1000000];
        
        // Force a refresh to get actual values, only if requested
        if (shouldForceRefresh) {
          setTimeout(() => {
            this.forceRefresh();
          }, 0);
        }
      }
    }
  }
}
