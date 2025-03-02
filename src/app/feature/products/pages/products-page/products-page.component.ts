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
    private categoryService: CategoryService
  ) {}

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
    return this.productFilters.filter((f) => f.label !== 'Пошук');
  }

  // We'll fetch products based on the current query params
  products$ = this.route.queryParams.pipe(
    takeUntil(this.destroy$),
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
          id: cat.id,
        }));

        // 2) Apply current query params to these filters (if any)
        const params = this.route.snapshot.queryParams;
        this.applyQueryParamsToFilters(params);
      });
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
    // 1) Categories
    let categoryIds: string[] = [];
    if (Array.isArray(params['categoriesIds'])) {
      categoryIds = params['categoriesIds'];
    } else if (typeof params['categoriesIds'] === 'string') {
      categoryIds = [params['categoriesIds']];
    }
    this.categoryFilters.forEach((cf) => {
      cf.value = categoryIds.includes(String(cf.id));
    });
  
    // 2) Search (STRING filter)
    const nameValue = params['name'] || '';
    const stringFilter = this.productFilters.find(
      (f) => f.type === FilterType.STRING
    );
    if (stringFilter) {
      stringFilter.value = nameValue;
    }
  
    // 3) PriceRange
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE
    );
    if (rangeFilter) {
      const priceRangeStr = params['priceRange'];
      if (priceRangeStr) {
        try {
          const parsed = JSON.parse(priceRangeStr);
          rangeFilter.valueStart = parsed.min;
          rangeFilter.valueEnd = parsed.max;
        } catch (err) {
          // fallback if parse fails
          rangeFilter.valueStart = 0;
          rangeFilter.valueEnd = 100;
        }
      }
    }
  }
  

  /**
   * Build a queryParams object from the local filters.
   * Now using priceRange as a single JSON-ified object
   */
  private buildQueryParamsFromFilters(): any {
    const queryParams: any = {};

    // 1) Gather all checked categories
    const checkedIds = this.categoryFilters
      .filter((cf) => cf.value === true)
      .map((cf) => cf.id);

    if (checkedIds.length) {
      queryParams['categoriesIds'] = checkedIds;
    }

    // 2) The string (search) filter
    const stringFilter = this.productFilters.find(
      (f) => f.type === FilterType.STRING
    );
    if (stringFilter && stringFilter.value) {
      queryParams['name'] = stringFilter.value;
    }

    // 3) The range filter -> single object: ?priceRange={"min":X,"max":Y}
    const rangeFilter = this.productFilters.find(
      (f) => f.type === FilterType.RANGE
    );
    if (rangeFilter) {
      const priceRangeObj = {
        min: rangeFilter.valueStart,
        max: rangeFilter.valueEnd,
      };
      queryParams['priceRange'] = JSON.stringify(priceRangeObj);
    }

    return queryParams;
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

    // 2) Parse the priceRange param
    let priceRange = { min: 0, max: 999999 };
    if (params['priceRange']) {
      try {
        priceRange = JSON.parse(params['priceRange']);
      } catch (err) {
        // fallback
      }
    }

    return {
      categoriesIds: catIds,
      name: params['name'] || '',
      priceRange: priceRange,
      page: 0,
      size: 10
    };
  }

  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    // Find the string filter
    const stringFilter = this.productFilters.find(
      (f) => f.type === FilterType.STRING
    );
    if (!stringFilter) {
      return;
    }
    // Update and re-emit
    stringFilter.value = searchTerm;
    this.onFilterChanged(stringFilter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
