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
  sessionName = '...';

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.subscription = this.session.sessionChange.subscribe(session => {
      if (session) {
        this.sessionName = session.person.name;
        this.hasSession = true;
      } else {
        this.sessionName = '...';
        this.hasSession = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
