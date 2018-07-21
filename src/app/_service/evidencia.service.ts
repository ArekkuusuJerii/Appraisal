import { Injectable } from '@angular/core';
import { API } from '../api.config';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Instance } from '../_model/organization';
import { PracticaEspecifica } from '../_model/cmmi';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';
import { Evidence, Hiperlink } from '../_model/evidence';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {

  constructor(private api: API, private http: HttpClient) {
  }

  get(inst: Instance, practice: PracticaEspecifica): Observable<Evidence> {
    const url = this.api.for(`evidencia/${inst.id}/${practice.id}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  download(file, evidence): Observable<Blob> {
    const url = this.api.for(`file/${evidence.id}/${file}`);
    return this.http.get(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/octet-stream'
      },
      responseType: 'blob'
    });
  }

  uploadFile(file: File, evidence: Evidence): Observable<HttpEvent<Evidence>> {
    const url = this.api.for(`file/${evidence.id}`);
    const formData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      headers: new HttpHeaders({
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      })
    });
    return this.http.request(req);
  }

  deleteFile(id: number): Observable<any> {
    const url = this.api.for(`file/${id}`);
    return this.http.delete(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  uploadHiperlink(hiperlink: string, evidence: Evidence): Observable<Hiperlink> {
    const url = this.api.for(`hipervinculo/${evidence.id}`);
    return this.http.post<Hiperlink>(url, hiperlink, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }

  deleteHiperlink(id: number): Observable<any> {
    const url = this.api.for(`hipervinculo/${id}`);
    return this.http.delete(url, {
      headers: {
        'Credentials': SessionService.getCredentials(),
        'Accept': 'application/json'
      }
    });
  }
}
