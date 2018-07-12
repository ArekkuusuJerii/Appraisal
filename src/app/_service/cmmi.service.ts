import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { Nivel } from '../_model/cmmi';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmmiService {

  constructor(private api: API, private http: HttpClient) { }

  getNiveles(): Observable<Nivel[]> {
    const url = this.api.for('cmmi/nivel');
    return this.http.get<Nivel[]>(url).pipe(catchError(() => []));
  }
}
