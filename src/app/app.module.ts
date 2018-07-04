import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { API } from './api.config';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GrowlModule } from 'primeng/growl';
import { AdminComponent } from './user/admin/admin.component';
import { OrgComponent } from './user/org/org.component';

const routes = [
  {path: 'dashboard/administrador', component: AdminComponent},
  {path: 'dashboard/organizacion', component: OrgComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: '/dashboard'}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
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
