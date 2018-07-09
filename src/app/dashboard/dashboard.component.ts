import { Component, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { MessageService } from '../_service/message.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private message: MessageService) {
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
        this.message.push({severity: 'success', summary: 'Has iniciado sesión', detail: 'Última sesión recuperada'});
      }, () => {
        this.message.push({severity: 'warning', summary: 'Has cerrado sesión', detail: 'Última sesión ha caducado'});
        this.session.deleteSession();
        window.location.reload();
      });
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.submitted = true;
    this.session.login(this.f.username.value, this.f.password.value).subscribe(
      user => {
        if (user.usuarioRol.descripcion === 'Administrador') {
          this.router.navigate(['dashboard/administrador']);
        } else {
          this.router.navigate(['dashboard/organizacion']);
        }
        this.message.push({severity: 'success', summary: 'Has iniciado sesión', detail: `${user.username}`});
      },
      () => {
        this.message.push({severity: 'warning', summary: 'Error', detail: 'Datos incorrectos'});
      }
    );
  }

}
