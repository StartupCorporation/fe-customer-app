export interface ProductImage {
  id: string;
  link: string;
}

export class Product {
  constructor(
    public id = '',
    public name = '',
    public images: ProductImage[] = [],
    public price = 0,
    public description = '',
    public stockQuantity = 0,
    public categoryId = '',
    public categoryName = ''
  ) { }

  public static fromJson(json: any): Product {
    if (!json) {
      return new Product();
    }

    try {
      // Ensure images is properly converted to ProductImage array
      let productImages: ProductImage[] = [];
      if (Array.isArray(json.images)) {
        productImages = json.images;
      }
      
      const product = new Product(
        json.id || '',
        json.name || '',
        productImages,
        json.price || 0,
        json.description || '',
        json.stockQuantity || 0,
        json.categoryId || '',
        json.categoryName || ''
      );
      
      return product;
    } catch (error) {
      return new Product(); // Return empty product rather than throwing
    }
  }

  public static fromArrayJson(jsonArray: any[]): Product[] {
    if (!Array.isArray(jsonArray)) {
      return [];
    }
    
    try {
      const products = jsonArray.map((product) => Product.fromJson(product));
      return products;
    } catch (error) {
      return [];
    }
  }
}
