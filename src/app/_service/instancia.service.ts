import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { Instance, Organizacion, Type } from '../_model/org';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstanciaService {

  constructor(private api: API, private http: HttpClient) {
  }

  getTypes(): Observable<Type[]> {
    const url = this.api.for('instancia/tipos');
    return this.http.get<Type[]>(url).pipe(catchError(() => []));
  }

  getAll(org: Organizacion): Observable<Instance[]> {
    const url = this.api.for(`instancia/${org.id}`);
    return this.http.get<Instance[]>(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    }).pipe(catchError(() => []));
  }

  save(inst: Instance, org: Organizacion): Observable<Instance> {
    const url = this.api.for(`instancia/${org.id}`);
    return this.http.post<Instance>(url, inst, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  delete(inst: Instance): Observable<any> {
    const url = this.api.for(`instancia/${inst.id}`);
    return this.http.delete(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  update(inst: Instance): Observable<Instance> {
    const url = this.api.for(`instancia/${inst.id}`);
    return this.http.put<Instance>(url, inst, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
}
