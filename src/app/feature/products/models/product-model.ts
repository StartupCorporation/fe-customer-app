export class Product {
  constructor(
    public id = '',
    public name = '',
    public images:string[] = [],
    public price = 0
  ) {}

  public static fromJson(json: any): Product {
    return new Product(
      json.id || '',
      json.name || '',
      Array.isArray(json.images) ? json.images : [],
      json.price || 0
    );
  }

  public static fromArrayJson(jsonArray: any[]): Product[] {
    return jsonArray.map((product) => Product.fromJson(product));
  }
}
