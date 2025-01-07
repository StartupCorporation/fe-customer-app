import { MessageTypeEnum } from "../enums/message-type-enum";

export class MessageModel {
  constructor(
    public status = 0,
    public message: string[] = [],
    public type = MessageTypeEnum.Success
  ) { }

  static fromJson(json: any): MessageModel {
    let resolvedType = json.status >= 200 && json.status < 300 ? MessageTypeEnum.Success : MessageTypeEnum.Error;
    let resolvedMessage = 'Unexpected error occurred';

    if (json.error?.detail)
      resolvedMessage = json.error.detail;
    else if (json.message && typeof json.message === 'string')
      resolvedMessage = json.message;

    return new MessageModel(json.status, [resolvedMessage], resolvedType);
  }

  public static fromArrayJson(json: any[]): MessageModel[] {
    return json.map((message) => MessageModel.fromJson(message));
  }
}
