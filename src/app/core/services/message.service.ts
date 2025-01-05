import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { MessageModel } from 'src/app/shared/models/message-model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new ReplaySubject<MessageModel[]>();
  private messages: MessageModel[] = []; 

  constructor() {
    this.messagesSubject.next(this.messages);
  }

  getMessages(): Observable<MessageModel[]> {
    return this.messagesSubject.asObservable();
  }

  addMessage(message: MessageModel): void {
    this.messages.push(message);
    this.messagesSubject.next(this.messages);
  }

  addMessageFromJson(json: any): void {
    const message = MessageModel.fromJson(json);
    this.addMessage(message);
  }

  deleteAllMessages(): void {
    this.messages = [];
    this.messagesSubject.next(this.messages);
  }
}
