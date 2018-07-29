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
      {field: 'name', width: '20%'},
      {field: 'description', width: '50%'},
      {field: 'status', width: '15%'},
      {field: 'progress', width: '15%'}
    ];
    this.setup();
  }

  setup() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.evaluationService.find(id).subscribe(org => {
      this.org = org;
    });
    this.evaluationService.getStatus(id).subscribe(evaluation => {
      this.evaluation = evaluation;
      this.evaluation.children.sort((a, b) => a.data.id - b.data.id);
      for (const sub0 of this.evaluation.children) {
        sub0.children.sort((a, b) => a.data.id - b.data.id);
        for (const sub1 of sub0.children) {
          sub1.children.sort((a, b) => a.data.id - b.data.id);
          for (const sub2 of sub1.children) {
            sub2.children.sort((a, b) => a.data.id - b.data.id);
          }
        }
      }
    });
  }

  close() {
    window.close();
  }

}
