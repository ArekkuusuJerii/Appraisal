import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.session.tryRedirect();
  }

}
