export class ConsultingModel {
  constructor(
    public customer: Customer = { name: '', phone: '' },
    public comment = '',
    public messageMe = false
  ) {}

  public static fromJson(json: Partial<ConsultingModel>): ConsultingModel {
    return new ConsultingModel(
      json.customer ?? { name: '', phone: '' },
      json.comment ?? '',
      json.messageMe ?? false
    );
  }

  public static fromArrayJson(json: any[]): ConsultingModel[] {
    return json.map((consulting) => ConsultingModel.fromJson(consulting));
  }

  public toJson(): Partial<ConsultingModel> {
    return {
      customer: this.customer,
      comment: this.comment,
      messageMe: this.messageMe
    };
  }
}

export interface Customer {
  name: string;
  phone: string;
}
