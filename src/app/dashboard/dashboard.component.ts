import { Component, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { MessageService } from '../_service/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private session: SessionService, private router: Router, private message: MessageService) {
  }

  ngOnInit() {
    if (SessionService.hasSession()) {
      this.session.validate().subscribe(() => {
        const user = SessionService.getSession();
        if (user.usuarioRol.descripcion === 'administrador') {
          this.router.navigate(['dashboard/administrador']);
        } else {
          this.router.navigate(['dashboard/organizacion']);
        }
        this.message.push({severity: 'success', summary: 'Has iniciado sesión', detail: 'Última sesión recuperada'});
      }, () => {
        this.message.push({severity: 'warning', summary: 'Has cerrado sesión', detail: 'Última sesión ha caducado'});
        localStorage.removeItem('session');
        this.router.navigate(['dashboard']);
      });
    }
  }

  login(user: string, password: string) {
    this.session.login(user, password).subscribe(
      data => {
        if (data.usuarioRol.descripcion === 'administrador') {
          this.router.navigate(['dashboard/administrador']);
        } else {
          this.router.navigate(['dashboard/organizacion']);
        }
        this.message.push({severity: 'success', summary: 'Has iniciado sesión', detail: `${data.person.name}`});
      },
      err => {
        this.message.push({severity: 'warning', summary: 'Error', detail: 'Datos incorrectos'});
      }
    );
  }

}
