import { Component, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  hasSession: boolean;

  constructor() { }

  ngOnInit() {
    this.hasSession = SessionService.hasSession();
  }
}
