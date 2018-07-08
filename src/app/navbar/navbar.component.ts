import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  hasSession: boolean;
  username = '...';

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.subscription = this.session.sessionChange.subscribe(session => {
      if (session) {
        this.username = session.username;
        this.hasSession = true;
      } else {
        this.username = '...';
        this.hasSession = false;
      }
    });
    if (SessionService.hasSession()) {
      this.username = SessionService.getSession().username;
      this.hasSession = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
