import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../api.config';
import { Observable } from 'rxjs';
import { Usuario } from '../_model/org';
import { SessionService } from './session.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private api: API, private http: HttpClient) {
  }

  getAll(): Observable<Usuario[]> {
    const url = this.api.for('user');
    return this.http.get<Usuario[]>(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    }).pipe(catchError(() => []));
  }

  save(usuario: Usuario): Observable<Usuario> {
    const url = this.api.for('user');
    return this.http.post<Usuario>(url, usuario, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json',
      }
    });
  }

  update(usuario: Usuario): Observable<Usuario> {
    const url = this.api.for('user');
    return this.http.put<Usuario>(url, usuario, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  delete(usuario: Usuario): Observable<any> {
    const url = this.api.for(`user/${usuario.id}`);
    return this.http.delete(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }
}
