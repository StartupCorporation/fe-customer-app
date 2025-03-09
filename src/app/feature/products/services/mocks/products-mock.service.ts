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

  private mockProduct: Product =
    {
      id: '1',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.0,
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae architecto iste officiis dolorem quibusdam ducimus. Iste qui reprehenderit molestiae architecto minus dolore perspiciatis quam, repudiandae exercitationem tenetur.Sequi, quibusdam maxime.Lorem ipsum dolor sit amet, consectetur adipisicing elit.Laudantium est hic eaque praesentium ad unde maxime.Nesciunt, magni, ducimus veromolestias doloremque nulla, dolor deleniti ab adipisci dolore sed odit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Iste, voluptate tempora sint esse quo eius nam in fuga sitimpedit ipsam illum reprehenderit quis voluptatum et fugit placeat quas? Ipsam."
    };

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.0,
    },
    {
      id: '2',
      name: 'Інвертор Deye SUN-10K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.63,
    },
    {
      id: '3',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '4',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 75555.1,
    },
    {
      id: '5',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '6',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '7',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '8',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '6',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '7',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '8',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '6',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    // {
    //   id: 7,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 8,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 6,
    //   name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 7,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 8,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
  ];

  getProducts(queryParams?: Record<string, any>): Observable<any> {
    // Clone the mock products to avoid modifying the original
    let filteredProducts = [...this.mockProducts];
    
    console.log('Mock service received query params:', queryParams);
    
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
          categoryIds.includes(product.id.split('-')[0])  // Assuming id format is "categoryId-productId"
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
      
      console.log('Price filter values:', minPrice, maxPrice);
      
      if (minPrice !== undefined && maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );
      }
    }
    
    // Get total count before pagination
    const totalElements = filteredProducts.length;
    
    // Apply pagination
    let page = queryParams?.['page'] ? Number(queryParams['page']) : 1;
    let size = queryParams?.['size'] ? Number(queryParams['size']) : 10;
    
    // Ensure page and size are valid
    page = Math.max(1, page);
    size = Math.max(1, Math.min(50, size));
    
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Return both the paginated products and pagination info
    return of({
      content: paginatedProducts,
      pagination: {
        totalElements: totalElements,
        page: page,
        size: size
      }
    }).pipe(delay(300)); // Simulate network delay
  }

  getProductById(productId: string): Observable<Product> {
    return of(this.mockProduct);
  }
}
