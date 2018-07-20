import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { AreaProceso, MetaEspecifica, Nivel, PracticaEspecifica } from '../_model/cmmi';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Instance, Organization } from '../_model/organization';

@Injectable({
  providedIn: 'root'
})
export class CmmiService {

  constructor(private api: API, private http: HttpClient) { }

  getNiveles(): Observable<Nivel[]> {
    const url = this.api.for('cmmi/nivel');
    return this.http.get<Nivel[]>(url).pipe(catchError(() => []));
  }

  getAreas(nivel: number): Observable<AreaProceso[]> {
    const url = this.api.for(`cmmi/area/${nivel}`);
    return this.http.get<AreaProceso[]>(url).pipe(catchError(() => []));
  }

  getMetas(area: number): Observable<MetaEspecifica[]> {
    const url = this.api.for(`cmmi/meta/${area}`);
    return this.http.get<MetaEspecifica[]>(url).pipe(catchError(() => []));
  }

  getPracticas(meta: number): Observable<PracticaEspecifica[]> {
    const url = this.api.for(`cmmi/practica/${meta}`);
    return this.http.get<PracticaEspecifica[]>(url).pipe(catchError(() => []));
  }

  getAllAreaProcesos(org: Organization): Observable<AreaProceso[]> {
    const url = this.api.for(`cmmi/area/${org.nivel.lvl}?all=true`);
    return this.http.get<AreaProceso[]>(url).pipe(catchError(() => []));
  }
}
