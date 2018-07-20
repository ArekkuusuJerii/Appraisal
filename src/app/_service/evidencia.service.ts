import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { Instance } from '../_model/organization';
import { PracticaEspecifica } from '../_model/cmmi';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
import { Evidence } from '../_model/evidence';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {

  constructor(private api: API, private http: HttpClient) { }

  get(inst: Instance, practice: PracticaEspecifica): Observable<Evidence> {
    const url = this.api.for(`evidencia/${inst.id}/${practice.id}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }
}
