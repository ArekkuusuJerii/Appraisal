import { Component, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../_service/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private session: SessionService,
    private router: Router,
    private message: NotificationService) {
  }

  ngOnInit() {
    if (SessionService.hasSession()) {
      this.session.validate().subscribe(() => {
        const user = SessionService.getSession();
        if (user.usuarioRol.descripcion === 'Administrador') {
          this.router.navigate(['dashboard/administrador']);
        } else {
          this.router.navigate(['dashboard/organizacion']);
        }
        this.message.notify('success', 'Has iniciado sesión', 'Última sesión recuperada');
      }, () => {
        this.message.notify('warn', 'Has cerrado sesión', 'Última sesión ha caducado');
        this.session.deleteSession();
      });
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username() { return this.loginForm.controls.username.value; }
  get password() { return this.loginForm.controls.password.value; }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.submitted = true;
    this.session.login(this.username, this.password).subscribe(user => {
        if (user.usuarioRol.descripcion === 'Administrador') {
          this.router.navigate(['dashboard/administrador']);
        } else {
          this.router.navigate(['dashboard/organizacion']);
        }
        this.message.notify('success', 'Has iniciado sesión', `${user.username}`);
      },
      () => {
        this.message.notify('warn', 'Error', 'Datos incorrectos');
        this.submitted = false;
      }
    );
  }

}
