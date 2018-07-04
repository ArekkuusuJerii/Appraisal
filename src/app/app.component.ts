import { Component, OnInit } from '@angular/core';
import { MessageService } from './_service/message.service';
import { Router } from '@angular/router';
import { SessionService } from './_service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(protected message: MessageService, private router: Router, private session: SessionService) {
  }

  ngOnInit() {
    if (SessionService.hasSession()) {
      this.session.validate().subscribe(() => {
        const user = SessionService.getSession();
        if (user.usuarioRol === 'administrador') {
          this.router.navigate(['dashboard/administrador']);
        } else {
          this.router.navigate(['dashboard/organizacion']);
        }
        this.message.push({severity: 'success', summary: 'Has iniciado sesión', detail: 'Última sesión recuperada'});
      }, () => {
        this.router.navigate(['login']);
        this.message.push({severity: 'warning', summary: 'Has cerrado sesión', detail: 'Última sesión ha caducado'});
        localStorage.removeItem('session');
      });
    }
  }
}
