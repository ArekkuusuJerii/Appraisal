import { Component, Input, OnInit } from '@angular/core';
import { Evidence } from '../../../_model/evidence';
import { EvidenciaService } from '../../../_service/evidencia.service';
import { API } from '../../../api.config';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../_service/notification.service';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css']
})
export class ArtifactsComponent implements OnInit {
  @Input() selection;
  cols: any[];
  evidence: Evidence;
  links = [];
  formHiperlink: FormGroup;
  activeLink: boolean;
  activeFile: boolean;

  constructor(
    private api: API,
    private evidenciaService: EvidenciaService,
    private message: NotificationService,
    private builder: FormBuilder) {
  }

  ngOnInit() {
    this.evidenciaService.get(this.selection.instance, this.selection.practice).subscribe(evidence => {
      this.evidence = evidence;
      this.sort();
    });
    this.cols = [
      {field: 'link', header: 'Hipervínculo', width: '60%'},
      {field: 'date', header: 'Fecha', width: '30%'}
    ];
    this.formHiperlink = this.builder.group({
      'hiperlink': ['', Validators.required]
    });
  }

  sort() {
    const links = [];
    for (const art of this.evidence.artefactos) {
      links.push(art);
    }
    for (const hpr of this.evidence.hipervinculos) {
      links.push(hpr);
    }
    links.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    this.links = links.map(a => {
      if (a.link) {
        return {
          id: a.id,
          link: a.link,
          date: a.fecha,
          file: null
        };
      } else {
        return {
          id: a.id,
          link: `${a.nombre}`,
          date: a.fecha,
          file: true
        };
      }
    });
  }

  download(artifact) {
    this.evidenciaService.download(artifact['id'], this.evidence).subscribe(data => {
      const blobURL = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.download = artifact['link'];
      anchor.href = blobURL;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobURL);
    });
  }

  uploadFile(event) {
    if (event.files[0]) {
      this.evidenciaService.uploadFile(event.files[0], this.evidence).subscribe(response => {
        switch (response.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            this.evidence.artefactos.push(response.body);
            this.sort();
            this.message.notify('success', 'Se ha subido un archivo');
            break;
          default:
        }
      });
    } else {
      this.message.notify('error', 'No hay un archivo seleccionado', 'Por favor seleccione un archivo');
    }
    this.activeLink = false;
    this.activeFile = false;
  }

  uploadHyperlink() {
    if (this.formHiperlink.valid) {
      this.evidenciaService.uploadHiperlink(this.formHiperlink.value.hiperlink, this.evidence).subscribe(hiperlink => {
        this.evidence.hipervinculos.push(hiperlink);
        this.sort();
        this.message.notify('success', 'Se ha subido un hipervínculo');
      });
      this.formHiperlink.reset();
    } else {
      this.message.notify('error', 'No hay un hipervínculo', 'Por favor ingrese un hipervínculo');
    }
    this.activeLink = false;
    this.activeFile = false;
  }

  delete(link) {
    if (link.file) {
      this.evidenciaService.deleteFile(link.id).subscribe(() => {
        this.message.notify('success', 'Se ha eliminado un archivo');
      });
      this.evidence.artefactos = this.evidence.artefactos.filter(a => a.id !== link.id);
      this.sort();
    } else {
      this.evidenciaService.deleteHiperlink(link.id).subscribe(() => {
        this.message.notify('success', 'Se ha eliminado un hipervinculo');
      });
      this.evidence.hipervinculos = this.evidence.hipervinculos.filter(a => a.id !== link.id);
      this.sort();
    }
  }
}
