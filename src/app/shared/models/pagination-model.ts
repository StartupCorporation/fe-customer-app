export class PaginationModel {
  constructor(public totalElements = 0, public page = 0, public size = 0) {}

  public static fromJson(json: any): PaginationModel {
    return new PaginationModel(json.totalElements, json.page, json.size);
  }
}
