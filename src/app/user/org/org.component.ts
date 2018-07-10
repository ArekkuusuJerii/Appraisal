import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})
export class OrgComponent implements OnInit {

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.session.tryRedirect();
  }

}
