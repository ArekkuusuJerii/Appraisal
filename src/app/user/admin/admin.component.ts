import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';
import { Usuario } from '../../_model/org';
import { Nivel } from '../../_model/cmmi';
import { MenuItem } from 'primeng/api';
import { UsuarioService } from '../../_service/usuario.service';
import { NotificationService } from '../../_service/notification.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  menuItems: MenuItem[];
  niveles: Nivel[];
  users: Usuario[] = [];
  user: Usuario;
  isNew = false;

  constructor(
    private session: SessionService,
    private usuarioService: UsuarioService,
    private message: NotificationService) {
  }

  ngOnInit() {
    this.session.tryRedirect();
    this.niveles = [
      {lvl: 1, descripcion: 'Nivel 2'},
      {lvl: 2, descripcion: 'Nivel 3'},
      {lvl: 3, descripcion: 'Nivel 4'},
      {lvl: 4, descripcion: 'Nivel 5'}
    ];
    this.menuItems = [
      {
        label: 'Cancelar', icon: 'fa-close', command: () => this.cancel()
      }
    ];
    this.usuarioService.getAll().subscribe(all => {
      this.users = all;
    });
  }

  get persona() {
    return this.user.persona;
  }

  get organizacion() {
    return this.user.organizacion;
  }

  edit(user) {
    this.user = user;
    this.isNew = false;
  }

  add() {
    this.user = {
      organizacion: {},
      persona: {}
    };
    this.isNew = true;
  }

  cancel() {
    this.user = null;
  }

  save() {
    if (this.user) {
      if (this.isNew) {
        this.usuarioService.save(this.user).subscribe(user => {
          this.message.notify('success', 'Se ha creado una organización');
          this.users.push(user);
          this.user = null;
        });
      } else {
        this.usuarioService.update(this.user).subscribe(user => {
          this.message.notify('success', 'Se ha actualizado una organización');
          const index = this.users.indexOf(this.user);
          this.users[index] = user;
          this.user = null;
        });
      }
    }
  }

}
