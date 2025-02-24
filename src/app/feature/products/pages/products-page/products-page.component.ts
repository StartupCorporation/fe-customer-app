import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
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
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  // If using a standalone component, include your imports array:
  imports: [
    LandingFooterComponent,
    LandingWelcomeWindowComponent,
    ProductsListComponent,
    ProductsFilterComponent,
    AsyncPipe,
    SafeArrayPipe,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
private route = inject(ActivatedRoute);
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoryService: CategoryMockService
  ) {}
  // We'll store category filters in an array (each a CHECKBOX filter).
  // Once categories load, we convert them to these filters.
  categoryFilters: any[] = [];

  // Example product filters array: one range filter + one text filter
  productFilters: any[] = [
    {
      label: 'Ціна',
      type: FilterType.RANGE,
      valueStart: 0,
      valueEnd: 80,
      minRange: 0,
      maxRange: 100,
      step: 1,
    },
    {
      label: 'Пошук',
      type: FilterType.STRING,
      value: '',
    },
  ];

  get availableProductFilters() {
    return this.productFilters.filter(f => f.label !== 'Пошук')
  }

  // We'll fetch products based on the current query params  
  products$ = this.route.queryParams.pipe(  
    takeUntil(this.destroy$),  
    // Whenever query params change, build a query object and fetch products  
    switchMap((params) => {  
      const queryObj = this.buildQueryObjectFromParams(params);  
      return this.productsService.getProducts(queryObj);  
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
          // Optionally store ID or any other property if you need it
          id: cat.id,
        }));

        // 2) Immediately apply current query params to these filters (if any)
        const params = this.route.snapshot.queryParams;
        this.applyQueryParamsToFilters(params);
      });
  }

  /**
   * Called by <app-products-filter> whenever a single filter changes.
   * We merge this updated filter, then rebuild the query params and navigate.
   */
  onFilterChanged(updatedFilter: GenericFilter): void {
    // 1) Determine which array (categories or productFilters) holds this filter
    //    We'll match by label or a unique ID.
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

    // 3) Update the URL with the new query params (staying on the same route)
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
    // 1) Categories: if we have ?categoryId=1&categoryId=2, it's an array
    let categoryIds: string[] = [];
    if (Array.isArray(params['categoryId'])) {
      categoryIds = params['categoryId'];
    } else if (typeof params['categoryId'] === 'string') {
      categoryIds = [params['categoryId']];
    }
    // Mark category filters that match these IDs as checked
    this.categoryFilters.forEach((cf) => {
      const thisCatId = cf['id']; // we stored id in filter
      cf.value = categoryIds.includes(String(thisCatId));
    });

    // 2) Search (STRING filter)
    const nameValue = params['name'] || '';
    const stringFilter = this.productFilters.find(
      (f) => f.type === FilterType.STRING
    );
    if (stringFilter) {
      stringFilter.value = nameValue;
    }

    // 3) Range filter: e.g. ?priceMin=10&priceMax=50
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE
    );
    if (rangeFilter) {
      if (params['priceMin']) {
        rangeFilter.valueStart = +params['priceMin'];
      }
      if (params['priceMax']) {
        rangeFilter.valueEnd = +params['priceMax'];
      }
    }
  }

  /**
   * Build a queryParams object from the local filters.
   * Example: gather all checked categories, the search string,
   * the price range, etc.
   */
  private buildQueryParamsFromFilters(): any {
    const queryParams: any = {};

    // 1) Gather all checked categories into ?categoryId=...
    const checkedIds = this.categoryFilters
      .filter((cf) => cf.value === true) // if .value is boolean
      .map((cf) => cf['id']); // stored category id in 'id'
    if (checkedIds.length) {
      // for multiple IDs, Angular can handle arrays -> `?categoryId=1&categoryId=2`
      queryParams['categoryId'] = checkedIds;
    }

    // 2) The string (search) filter
    const stringFilter = this.productFilters.find(
      (f) => f.type === FilterType.STRING
    );
    if (stringFilter && stringFilter.value) {
      queryParams['name'] = stringFilter.value;
    }

    // 3) The range filter
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE
    );
    if (rangeFilter) {
      queryParams['priceMin'] = rangeFilter.valueStart;
      queryParams['priceMax'] = rangeFilter.valueEnd;
    }

    return queryParams;
  }

  /**
   * Build a service query object from query params that the productsService expects.
   * (If your service expects `categoryId` array, `search`, `priceMin`, `priceMax`, etc.)
   */
  private buildQueryObjectFromParams(params: any): any {
    // categoryId might be single or multiple
    let catIds: string[] = [];
    if (Array.isArray(params['categoryId'])) {
      catIds = params['categoryId'];
    } else if (typeof params['categoryId'] === 'string') {
      catIds = [params['categoryId']];
    }

    return {
      categoryId: catIds,
      name: params['name'] || '',
      priceMin: params['priceMin'] || 0,
      priceMax: params['priceMax'] || 999999,
    };
  }

  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
  
    // Find the string filter in your productFilters array
    const stringFilter = this.productFilters.find(
      (f) => f.type === FilterType.STRING
    );
    if (!stringFilter) {
      return;
    }
  
    // Update the filter value
    stringFilter.value = searchTerm;
  
    // Re-emit this filter change so the component updates query params
    this.onFilterChanged(stringFilter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
