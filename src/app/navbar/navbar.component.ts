import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../_service/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  hasSession: boolean;
  username = '...';

  constructor(
    private session: SessionService,
    private message: NotificationService,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.session.sessionChange.subscribe(session => {
      if (session) {
        this.username = session.persona.nombre + ' ' + session.persona.primerApellido + ' ' + session.persona.segundoApellido;
        this.hasSession = true;
      } else {
        this.username = '...';
        this.hasSession = false;
      }
    });
    if (SessionService.hasSession()) {
      const session = SessionService.getSession();
      this.username = session.persona.nombre + ' ' + session.persona.primerApellido + ' ' + session.persona.segundoApellido;
      this.hasSession = true;
    }
  }

  logout() {
    this.session.logout().subscribe(() => {
        this.message.notify('success', 'Has cerrado sesión');
        this.session.deleteSession();
        this.router.navigate(['/dashboard']);
      }, () => {
      this.message.notify('warn', 'No fue posible contactar el servidor');
      this.session.deleteSession();
      this.router.navigate(['/dashboard']);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
