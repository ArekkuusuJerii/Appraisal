import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import * as CryptoJS from 'crypto-js';
import { Usuario } from '../_model/session';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  static hasSession(): boolean {
    return localStorage.getItem('session') != null;
  }

  static getSession(): Usuario {
    if (this.hasSession()) {
      return JSON.parse(localStorage.getItem('session'));
    } else {
      return null;
    }
  }

  static getCredentials(): string {
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

  constructor(private api: API, private http: HttpClient) {}

  login(user, password): Observable<Usuario> {
    const url = this.api.for('session/login');
    return this.http.get<Usuario>(url, {
      headers: {
        'Accept': 'application/json',
        'Credentials': btoa(`${user}:${password}`)
      }
    }).pipe(
      tap(session => localStorage.setItem('session', JSON.stringify(session)))
    );
  }

  logout(): Observable<any> {
    const url = this.api.for('session/logout');
    return this.http.get(url, {
      observe: 'response',
      headers: {'Credentials': SessionService.getCredentials()}
    });
  }

  validate(): Observable<any> {
    const url = this.api.for('session/validate');
    return this.http.get(url, {
      observe: 'response',
      headers: {'Credentials': SessionService.getCredentials()}
    });
  }
}
