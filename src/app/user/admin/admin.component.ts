import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';
import { Organization, User } from '../../_model/organization';
import { Nivel } from '../../_model/cmmi';
import { MenuItem } from 'primeng/api';
import { UsuarioService } from '../../_service/usuario.service';
import { NotificationService } from '../../_service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CmmiService } from '../../_service/cmmi.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  menuItems: MenuItem[];
  niveles: Nivel[];
  formUser: FormGroup;
  users: User[] = [];
  user: User;
  copy: User;
  org: Organization;
  isNew = false;
  drag;

  constructor(
    private session: SessionService,
    private usuarioService: UsuarioService,
    private cmmi: CmmiService,
    private message: NotificationService,
    private builder: FormBuilder) {
  }

  ngOnInit() {
    this.session.tryRedirect();
    this.cmmi.getNiveles().subscribe(niveles => this.niveles = niveles);
    this.menuItems = [
      {
        label: 'Cancelar', icon: 'fa-close', command: () => this.cancel()
      }
    ];
    this.formUser = this.builder.group({
      'titulo': ['', Validators.required],
      'nivel': ['', Validators.required],
      'nombre': ['', Validators.required],
      'apellido-p': ['', Validators.required],
      'apellido-m': ['', Validators.required],
      'username': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.usuarioService.getAll().subscribe(all => {
      this.users = all;
    });
  }

  get controlU() {
    return this.formUser.controls;
  }

  get persona() {
    return this.user.persona;
  }

  get organizacion() {
    return this.user.organizacion;
  }

  edit(user: User) {
    if (this.copy) {
      this.cancel();
    }
    this.user = user;
    this.isNew = false;
    this.copy = {
      id: user.id,
      username: user.username,
      password: user.password,
      persona: {
        id: user.persona.id,
        nombre: user.persona.nombre,
        primerApellido: user.persona.primerApellido,
        segundoApellido: user.persona.segundoApellido,
      },
      organizacion: {
        id: user.organizacion.id,
        nombre: user.organizacion.nombre,
        nivel: user.organizacion.nivel,
      }
    };
  }

  add() {
    if (this.copy) {
      this.cancel();
    }
    this.user = {
      organizacion: {},
      persona: {}
    };
    this.org = null;
    this.copy = null;
    this.isNew = true;
    this.formUser.reset();
  }

  save() {
    if (this.user) {
      if (this.formUser.valid) {
        const users = [...this.users];
        if (this.isNew) {
          this.usuarioService.save(this.user).subscribe(user => {
            users.push(user);
            this.users = users;
            this.user = null;
            this.copy = null;
            this.message.notify('success', 'Se ha creado una organización');
          });
        } else {
          this.usuarioService.update(this.user).subscribe(user => {
            users[users.indexOf(this.user)] = user;
            this.users = users;
            this.user = null;
            this.copy = null;
            this.message.notify('success', 'Se ha actualizado una organización');
          });
        }
      } else {
        this.message.notify('error', 'Hay errores presentes', 'Existen errores en su formulario');
      }
    }
  }

  delete() {
    if (!this.isNew) {
      this.usuarioService.delete(this.user).subscribe(() => {
        this.message.notify('success', 'Se ha eliminado una organización');
      });
      this.users = this.users.filter(user => user !== this.user);
      this.user = null;
      this.copy = null;
    }
  }

  cancel() {
    if (!this.isNew) {
      const users = [...this.users];
      users[users.indexOf(this.user)] = this.copy;
      this.users = users;
      this.user = null;
      this.copy = null;
    } else {
      this.user = null;
      this.copy = null;
    }
    this.formUser.reset();
  }

}
