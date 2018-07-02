import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../api.config';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
import { PracticaEspecifica } from '../_model/cmmi';
import { Status } from '../_model/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private api: API, private session: SessionService, private http: HttpClient) { }

  getStatus(organizacion: number): Observable<Status> {
    const url = this.api.for(`evaluacion/${organizacion}`);
    return this.http.get<Status>(url, {
      headers: {'Credentials': this.session.getCredentials()}
    });
  }

  getMissing(organizacion: number): Observable<PracticaEspecifica[]> {
    const url = this.api.for(`evaluacion/missing/${organizacion}`);
    return this.http.get<PracticaEspecifica[]>(url, {
      headers: {'Credentials': this.session.getCredentials()}
    });
  }
}
