import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { AreaProceso, Nivel } from '../_model/cmmi';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Instance, Organizacion } from '../_model/org';

@Injectable({
  providedIn: 'root'
})
export class CmmiService {

  constructor(private api: API, private http: HttpClient) { }

  getNiveles(): Observable<Nivel[]> {
    const url = this.api.for('cmmi/nivel');
    return this.http.get<Nivel[]>(url).pipe(catchError(() => []));
  }

  getAreaProcesos(org: Organizacion): Observable<AreaProceso[]> {
    const url = this.api.for(`cmmi/area/${org.nivel.lvl}?all=true`);
    return this.http.get<AreaProceso[]>(url).pipe(catchError(() => []));
  }
}
