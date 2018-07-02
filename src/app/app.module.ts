import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { API } from './api.config';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

const routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [API],
  bootstrap: [AppComponent]
})
export class AppModule {
}
