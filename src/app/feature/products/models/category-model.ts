
export class CategoryModel{
    constructor(
        public id = 0,
        public name = '',
        public description = '',
        public imageLink = ''
    ){}

    public static fromJson(json: any): CategoryModel {
        return new CategoryModel(json.id, json.name, json.description, json.imageLink);
      }
    
      public static fromArrayJson(json: any[]): CategoryModel[] {
        return json.map((category) => CategoryModel.fromJson(category));
      }
    
      public toJson(): any {
        return {
          id: this.id,
          name: this.name,
          description: this.description,
          imageLink: this.imageLink
        };
      }
}