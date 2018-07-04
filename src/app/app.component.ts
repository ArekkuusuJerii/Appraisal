import { Component, OnInit } from '@angular/core';
import { MessageService } from './_service/message.service';
import { Router } from '@angular/router';
import { SessionService } from './_service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(protected message: MessageService, private router: Router, private session: SessionService) {
  }

  ngOnInit() {
    if (!this.session.hasSession() && !this.session.validate()) {
      this.router.navigate(['/login']);
    }
  }
}
