import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';
import { Organizacion, Usuario } from '../../_model/org';
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
  users: Usuario[] = [];
  user: Usuario;
  copy: Usuario;
  org: Organizacion;
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

  edit(user: Usuario) {
    if (!user) {
      return;
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

  delete() {
    if (!this.isNew) {
      this.usuarioService.delete(this.user).subscribe();
      this.users = this.users.filter(user => user !== this.user);
      this.user = null;
    }
  }

  add() {
    this.user = {
      organizacion: {},
      persona: {}
    };
    this.org = null;
    this.copy = null;
    this.isNew = true;
    this.formUser.reset();
  }

  cancel() {
    if (!this.isNew) {
      const index = this.users.indexOf(this.user);
      this.users[index] = this.copy;
      this.user = null;
    } else {
      this.user = null;
    }
    this.formUser.reset();
  }

  save() {
    if (this.user) {
      if (!this.formUser.invalid) {
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
      } else {
        this.message.notify('error', 'Hay errores presentes', 'Solucione sus errores');
      }
    }
  }

}
