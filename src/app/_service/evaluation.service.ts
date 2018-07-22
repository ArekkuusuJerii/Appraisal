import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../api.config';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
import { PracticaEspecifica } from '../_model/cmmi';
import { Status } from '../_model/evaluation';
import { Organization } from '../_model/organization';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private api: API, private http: HttpClient) { }

  find(id: number): Observable<Organization> {
    const url = this.api.for(`organizacion/${id}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  getStatus(organizacion: number): Observable<Status> {
    const url = this.api.for(`evaluacion/${organizacion}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  getMissing(organizacion: number): Observable<PracticaEspecifica[]> {
    const url = this.api.for(`evaluacion/missing/${organizacion}`);
    return this.http.get<PracticaEspecifica[]>(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }
}
