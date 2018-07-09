import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../_service/message.service';
import { Router } from '@angular/router';

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
    private message: MessageService,
    private router: Router) { }

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

  logout() {
    this.session.logout().subscribe(() => {
        this.message.push({severity: 'success', summary: 'Has cerrado sesión'});
        this.session.deleteSession();
        this.router.navigate(['/dashboard']);
      }, () => {
        this.message.push({severity: 'warning', summary: 'Error al cerrar sesión', detail: 'Credenciales incorrectas'});
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
