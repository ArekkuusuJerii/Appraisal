import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../../_service/evaluation.service';
import { SessionService } from '../../../_service/session.service';
import { Organization } from '../../../_model/organization';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {
  org: Organization;
  evaluation;
  cols;

  constructor(
    private session: SessionService,
    private evaluationService: EvaluationService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.session.tryRedirect(null);
    this.cols = [
      {field: 'nombre', header: 'Nombre', width: '20%'},
      {field: 'descripcion', header: 'Descripción', width: '80%'}
    ];
    this.setup();
  }

  setup() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.evaluationService.find(id).subscribe(org => {
      this.org = org;
    });
    this.evaluationService.getStatus(id).subscribe(status => {
      this.evaluationService.getMissing(id).subscribe(missing => {
        const sorted = missing.sort((a, b) => a.id - b.id);
        this.evaluation = {
          status: status,
          missing: sorted
        };
      });
    });
  }

  close() {
    window.close();
  }

}
