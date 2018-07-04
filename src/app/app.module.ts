import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { API } from './api.config';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GrowlModule } from 'primeng/growl';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './user/admin/admin.component';
import { OrgComponent } from './user/org/org.component';

const routes = [
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    LoginComponent,
    AdminComponent,
    OrgComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GrowlModule,
    RouterModule.forRoot(routes)
  ],
  providers: [API],
  bootstrap: [AppComponent]
})
export class AppModule {
}
