import { Component, OnInit } from '@angular/core';
import { MessageService } from './_service/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(protected message: MessageService) {
  }

  ngOnInit() {
  }
}
