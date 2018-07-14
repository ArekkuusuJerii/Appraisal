import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';


type Severities = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  msgs: Message[] = [];

  constructor() {
  }

  notify(severity: Severities, summary: string, detail?: string) {
    this.msgs = [];
    this.msgs.push({ severity, summary, detail });
  }
}
