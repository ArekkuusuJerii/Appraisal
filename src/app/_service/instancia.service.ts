import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { Instance, Organization, Type } from '../_model/organization';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstanciaService {

  constructor(private api: API, private http: HttpClient) {
  }

  getIsNameTaken(name: string): Observable<any> {
    const url = this.api.for(`instancia/name?title=${name}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  getTypes(): Observable<Type[]> {
    const url = this.api.for('instancia/tipos');
    return this.http.get<Type[]>(url).pipe(catchError(() => []));
  }

  getAll(org: Organization): Observable<Instance[]> {
    const url = this.api.for(`instancia/${org.id}`);
    return this.http.get<Instance[]>(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    }).pipe(catchError(() => []));
  }

  save(inst: Instance, org: Organization): Observable<Instance> {
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
