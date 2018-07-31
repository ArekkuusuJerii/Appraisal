import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '../../_service/session.service';
import { Organization, User } from '../../_model/organization';
import { Nivel } from '../../_model/cmmi';
import { ConfirmationService } from 'primeng/api';
import { UsuarioService } from '../../_service/usuario.service';
import { NotificationService } from '../../_service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CmmiService } from '../../_service/cmmi.service';

const titlePattern = '^[0-9a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_:().´&?!#$,\\\\-]([0-9a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_:().´&?!#$,\\\\-]| (?! ))*$';
const txtPattern = '^[a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ´]([a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ´]| (?! ))*$';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
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
    private builder: FormBuilder,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.session.tryRedirect();
    this.cmmi.getNiveles().subscribe(niveles => this.niveles = niveles);
    this.formUser = this.builder.group({
      'titulo': ['', Validators.compose([
        Validators.required, Validators.pattern(titlePattern)
      ])],
      'nivel': ['', Validators.required],
      'nombre': ['', Validators.compose([
        Validators.required, Validators.pattern(txtPattern)
      ])],
      'apellido-p': ['', Validators.compose([
        Validators.required, Validators.pattern(txtPattern)
      ])],
      'apellido-m': ['', Validators.compose([
        Validators.required, Validators.pattern(txtPattern)
      ])],
      'username': ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      'password': ['', Validators.compose([
        Validators.required, Validators.minLength(6)
      ])]
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
    if (this.user === user) {
      return;
    }
    this.reset();
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
      this.reset();
    }
    this.user = {
      organizacion: {},
      persona: {}
    };
    this.org = null;
    this.copy = null;
    this.isNew = true;
    this.formUser.reset();
    this.formUser.controls['nivel'].markAsDirty();
  }

  save() {
    if (this.user) {
      if (this.formUser.valid) {
        const users = [...this.users];
        if (this.isNew) {
          this.confirmationService.confirm({
            message: '¿Desea crear esta organización?',
            accept: () => {
              this.usuarioService.save(this.user).subscribe(user => {
                users.push(user);
                this.users = users;
                this.formUser.markAsUntouched();
                this.message.notify('success', 'Se ha creado una organización');
                this.edit(user);
              });
            }
          });
        } else {
          this.confirmationService.confirm({
            message: '¿Desea guardar los cambios realizados?',
            accept: () => {
              this.usuarioService.update(this.user).subscribe(user => {
                users[users.indexOf(this.user)] = user;
                this.users = users;
                this.formUser.markAsUntouched();
                this.message.notify('success', 'Se ha actualizado una organización');
                this.edit(user);
              });
            }
          });
        }
      } else {
        this.message.notify('error', 'Hay errores presentes', 'Existen errores en su formulario');
      }
    }
  }

  delete() {
    if (!this.isNew) {
      this.confirmationService.confirm({
        message: '¿Desea eliminar esta organización?',
        accept: () => {
          this.usuarioService.delete(this.user).subscribe(() => {
            this.message.notify('success', 'Se ha eliminado una organización');
          });
          this.users = this.users.filter(user => user !== this.user);
          this.user = null;
          this.copy = null;
        }
      });
    }
  }

  cancel() {
    if (this.formUser.touched) {
      this.confirmationService.confirm({
        message: '¿Descartar cambios?',
        accept: () => {
          this.reset();
          this.formUser.reset();
        }
      });
    } else {
      this.reset();
      this.formUser.reset();
    }
  }

  reset() {
    if (!this.isNew) {
      const users = [...this.users];
      users[users.indexOf(this.user)] = this.copy;
      this.users = users;
    }
    this.user = null;
    this.copy = null;
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownEscapeHandler() {
    if (!this.org) {
      this.cancel();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownBackspaceHandler(evt: KeyboardEvent) {
    if (evt.keyCode === 46 && this.user) {
      this.delete();
    }
  }

}
