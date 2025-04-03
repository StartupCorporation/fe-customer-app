import { Injectable } from '@angular/core';
import { Product } from '../../models/product-model';
import { filter, map, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsMockService extends ApiService {
  readonly urlPath = 'products' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
  }

  private mockProduct: Product = {
    id: '6f30269e-7d10-4d51-9adf-62ac4a50f9af',
    name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    images: [
      {
        id: 'ed25e207-8bdd-4cf2-84fe-2ba3a20ece98',
        link: '/assets/images/category-1-Photoroom.png'
      }
    ],
    price: 49051.0,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae architecto iste officiis dolorem quibusdam ducimus. Iste qui reprehenderit molestiae architecto minus dolore perspiciatis quam, repudiandae exercitationem tenetur.Sequi, quibusdam maxime.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Laudantium est hic eaque praesentium ad unde maxime.Nesciunt, magni, ducimus veromolestias doloremque nulla, dolor deleniti ab adipisci dolore sed odit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Iste, voluptate tempora sint esse quo eius nam in fuga sitimpedit ipsam illum reprehenderit quis voluptatum et fugit placeat quas? Ipsam.",
    stockQuantity: 25,
    categoryId: '192fc28a-7603-4dd6-81e1-6294569080b3',
    categoryName: 'inverters'
  };

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: [
        {
          id: 'img1',
          link: '/assets/images/category-1-Photoroom.png'
        }
      ],
      price: 49051.0,
      description: 'Powerful inverter for home use',
      stockQuantity: 15,
      categoryId: 'inv-cat-1',
      categoryName: 'inverters'
    },
    {
      id: '2',
      name: 'Інвертор Deye SUN-10K-SG03LP1-EU',
      images: [
        {
          id: 'img2',
          link: '/assets/images/category-1-Photoroom.png'
        }
      ],
      price: 49051.63,
      description: 'High capacity inverter',
      stockQuantity: 8,
      categoryId: 'inv-cat-1',
      categoryName: 'inverters'
    },
    {
      id: '3',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: [
        {
          id: 'img3',
          link: '/assets/images/category-1-Photoroom.png'
        }
      ],
      price: 49051.1,
      description: 'Standard inverter model',
      stockQuantity: 12,
      categoryId: 'inv-cat-1',
      categoryName: 'inverters'
    },
    {
      id: '4',
      name: 'Smartwatch',
      images: [
        {
          id: 'img4',
          link: '/assets/images/category-1-Photoroom.png'
        }
      ],
      price: 75555.1,
      description: 'Advanced smartwatch with solar charging',
      stockQuantity: 20,
      categoryId: 'watch-cat-1',
      categoryName: 'watches'
    },
    {
      id: '5',
      name: 'Smartwatch Pro',
      images: [
        {
          id: 'img5',
          link: '/assets/images/category-1-Photoroom.png'
        }
      ],
      price: 49051.1,
      description: 'Professional smartwatch model',
      stockQuantity: 5,
      categoryId: 'watch-cat-1',
      categoryName: 'watches'
    }
  ];

  getProducts(queryParams?: Record<string, any>): Observable<any> {
    // Clone the mock products to avoid modifying the original
    let filteredProducts = [...this.mockProducts];
    
    
    // Apply filters if provided
    if (queryParams) {
      // Filter by categories
      let categoryIds: string[] = [];
      if (Array.isArray(queryParams['categoriesIds'])) {
        categoryIds = queryParams['categoriesIds'];
      } else if (typeof queryParams['categoriesIds'] === 'string') {
        categoryIds = [queryParams['categoriesIds']];
      }
      
      if (categoryIds.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          categoryIds.includes(product.categoryId)
        );
      }
      
      // Filter by search term
      if (queryParams['name']) {
        const searchTerm = queryParams['name'].toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by price range
      const minPrice = queryParams['price.min'] ? Number(queryParams['price.min']) : undefined;
      const maxPrice = queryParams['price.max'] ? Number(queryParams['price.max']) : undefined;      
      if (minPrice !== undefined && maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );
      }
    }
    
    // Calculate price range for all filtered products
    const prices = filteredProducts.map(p => p.price);
    const priceRange = {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0
    };
    
    // Get total count before pagination
    const totalElements = filteredProducts.length;
    
    // Apply pagination
    let page = queryParams?.['page'] ? Number(queryParams['page']) : 0;
    let size = queryParams?.['size'] ? Number(queryParams['size']) : 10;
    
    // Ensure page and size are valid
    page = Math.max(0, page); // API uses 0-based indexing
    size = Math.max(1, Math.min(50, size));
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Match the backend response format
    return of({
      content: paginatedProducts,
      priceRange: priceRange,
      totalPages: Math.ceil(totalElements / size),
      totalElements: totalElements,
      last: startIndex + size >= totalElements,
      size: size,
      number: page,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      },
      numberOfElements: paginatedProducts.length,
      first: page === 0,
      empty: paginatedProducts.length === 0
    }).pipe(delay(300)); // Simulate network delay
  }

  getProductById(productId: string): Observable<Product> {
    return of(this.mockProduct);
  }
}
