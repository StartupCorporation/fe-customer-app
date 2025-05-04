export class ConsultingModel {
  constructor(
    public personalInformation: PersonalInformation = { name: '', phoneNumber: '', email: '' },
    public customerNote = '',
    public messageCustomer = false
  ) {}

  public static fromJson(json: Partial<ConsultingModel>): ConsultingModel {
    return new ConsultingModel(
      json.personalInformation ?? { name: '', phoneNumber: '', email: '' },
      json.customerNote ?? '',
      json.messageCustomer ?? false
    );
  }

  public static fromArrayJson(json: any[]): ConsultingModel[] {
    return json.map((consulting) => ConsultingModel.fromJson(consulting));
  }

  public toJson(): Partial<ConsultingModel> {
    return {
      personalInformation: this.personalInformation,
      customerNote: this.customerNote,
      messageCustomer: this.messageCustomer
    };
  }
}

export interface PersonalInformation {
  name: string;
  phoneNumber: string;
  email: string;
}
