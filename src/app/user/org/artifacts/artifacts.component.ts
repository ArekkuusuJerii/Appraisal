import { Component, Input, OnInit } from '@angular/core';
import { Evidence } from '../../../_model/evidence';
import { EvidenciaService } from '../../../_service/evidencia.service';

@Component({
  selector: 'app-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css']
})
export class ArtifactsComponent implements OnInit {
  @Input() selection;
  evidence: Evidence;

  constructor(private evidenciaService: EvidenciaService) { }

  ngOnInit() {
    this.evidenciaService.get(this.selection.instance, this.selection.practice).subscribe(evidence => {
      this.evidence = evidence;
    });
  }

  upload(event) {
  }
}
