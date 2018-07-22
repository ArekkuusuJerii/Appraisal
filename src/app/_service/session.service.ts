import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import * as CryptoJS from 'crypto-js';
import { Session } from '../_model/session';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessionChange = new Subject<Session>();

  static hasSession(): boolean {
    return localStorage.getItem('session') != null;
  }

  static getSession(): Session {
    if (this.hasSession()) {
      return JSON.parse(localStorage.getItem('session'));
    } else {
      return null;
    }
  }

  static getCredentials(): string {
    const session = this.getSession();
    const timestamp = new Date().getTime();
    const message = `{${session.key}}:{${session.token}}:{${timestamp}}`;
    const encrypted_message = CryptoJS.HmacSHA256(message, session.key);
    const hash = CryptoJS.enc.Base64.stringify(encrypted_message);
    return JSON.stringify({
      token: session.token,
      hash: hash,
      timestamp: timestamp
    });
  }

  constructor(
    private api: API,
    private http: HttpClient,
    private message: NotificationService,
    private router: Router) {
  }

  login(user, password): Observable<Session> {
    const url = this.api.for('session/login');
    return this.http.get<Session>(url, {
      headers: {
        'Accept': 'application/json',
        'Credentials': btoa(`${user}:${password}`)
      }
    }).pipe(
      tap(session => {
        localStorage.setItem('session', JSON.stringify(session));
        this.sessionChange.next(session);
      })
    );
  }

  logout(): Observable<string> {
    const url = this.api.for('session/logout');
    return this.http.get<any>(url, {
      headers: {'Credentials': SessionService.getCredentials()}
    }).pipe(map(res => res.body));
  }

  validate(): Observable<string> {
    const url = this.api.for('session/validate');
    return this.http.get<any>(url, {
      headers: {'Credentials': SessionService.getCredentials()}
    }).pipe(map(res => res.body));
  }

  tryRedirect(adm = 'dashboard/administrador', org = 'dashboard/organizacion') {
    if (SessionService.hasSession()) {
      this.validate().subscribe(() => {
        const user = SessionService.getSession();
        if (user.usuarioRol.descripcion === 'Administrador') {
          if (adm) {
            this.router.navigate([adm]);
          }
        } else {
          this.router.navigate([org]);
        }
      }, () => {
        this.deleteSession();
        this.message.notify('warn', 'Has cerrado sesión', 'Última sesión ha caducado');
        this.router.navigate(['dashboard']);
      });
    } else {
      this.message.notify('warn', 'No hay alguna sesión activa');
      this.router.navigate(['dashboard']);
    }
  }

  deleteSession() {
    localStorage.removeItem('session');
    this.sessionChange.next(null);
  }
}
