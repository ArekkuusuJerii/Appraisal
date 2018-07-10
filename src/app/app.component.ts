import { Component, OnInit } from '@angular/core';
import { NotificationService } from './_service/notification.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  msgs: Message[] = [];

  constructor(protected message: NotificationService) {
  }
  ngOnInit() {
  }
}
