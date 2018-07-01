import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages = [];

  constructor() { }

  push(msg: string | string[]) {
    this.messages = [];
    this.messages.push(msg);
  }
}
