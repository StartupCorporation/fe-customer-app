export class ConsultingModel {
  constructor(
    public customer: Customer = { name: '', phone: '', email: '' },
    public comment = '',
    public contactMe = false
  ) {}

  public static fromJson(json: Partial<ConsultingModel>): ConsultingModel {
    return new ConsultingModel(
      json.customer ?? { name: '', phone: '', email: '' },
      json.comment ?? '',
      json.contactMe ?? false
    );
  }

  public static fromArrayJson(json: any[]): ConsultingModel[] {
    return json.map((consulting) => ConsultingModel.fromJson(consulting));
  }

  public toJson(): Partial<ConsultingModel> {
    return {
      customer: this.customer,
      comment: this.comment,
      contactMe: this.contactMe
    };
  }
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
}
