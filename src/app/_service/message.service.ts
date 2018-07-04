import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages = [];

  push(msg: Message | Message[]) {
    this.messages = [];
    this.messages.push(msg);
  }
}
