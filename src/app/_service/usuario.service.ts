import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../api.config';
import { Observable } from 'rxjs';
import { Type, User } from '../_model/organization';
import { SessionService } from './session.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private api: API, private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    const url = this.api.for('user');
    return this.http.get<User[]>(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    }).pipe(catchError(() => []));
  }

  getIsEmailTaken(email: string): Observable<any> {
    const url = this.api.for(`user/username?email=${email}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  save(usuario: User): Observable<User> {
    const url = this.api.for('user');
    return this.http.post<User>(url, usuario, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  update(usuario: User): Observable<User> {
    const url = this.api.for(`user/${usuario.id}`);
    return this.http.put<User>(url, usuario, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  delete(usuario: User): Observable<any> {
    const url = this.api.for(`user/${usuario.id}`);
    return this.http.delete(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }
}
