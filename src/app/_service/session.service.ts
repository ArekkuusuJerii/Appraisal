import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CryptoJS from 'crypto-js';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private api: API, private message: MessageService, private http: HttpClient) {}

  login(user, password): boolean {
    const url = this.api.for('session/login');
    let success = false;
    this.http.get(url, {
      headers: {
        'Accept': 'application/json',
        'Credentials': btoa(`${user}:${password}`)
      }
    }).pipe(map(session => JSON.stringify(session))).subscribe(session => {
      localStorage.setItem('session', session);
      success = true;
    }, err => this.message.push(err));
    return success;
  }

  logout() {
    const url = this.api.for('session/logout');
    this.http.get(url, {
      observe: 'response',
      headers: {'Credentials': this.getCredentials()}
    }).subscribe(() => {
      localStorage.removeItem('session');
    }, err => this.message.push(err));
  }

  validate(): boolean {
    const url = this.api.for('session/validate');
    let success = false;
    this.http.get(url, {
      observe: 'response',
      headers: {'Credentials': this.getCredentials()}
    }).subscribe(
      () => success = true,
      err => {
        localStorage.removeItem('session');
        this.message.push(err);
      }
    );
    return success;
  }

  hasSession(): boolean {
    return this.getSession() != null;
  }

  getSession(): Session {
    if (this.hasSession()) {
      return JSON.parse(localStorage.getItem('session'));
    } else {
      return null;
    }
  }

  getCredentials(): string {
    const session = this.getSession();
    const timestamp = new Date().getTime();
    const message = `{${session.key}}:{${session.token}:{${timestamp}`;
    const encrypted_message = btoa(CryptoJS.HmacSHA1(message, session.key));
    return JSON.stringify({
      token: session.token,
      hash: encrypted_message,
      timestamp: timestamp
    });
  }
}
