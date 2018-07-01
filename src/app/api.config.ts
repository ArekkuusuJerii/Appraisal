import { Injectable } from '@angular/core';

@Injectable()
export class API {
  url = 'http://localhost:8080/api';
  json: {
    'Accept': 'application/json'
  };

  for(url: string) {
    return `${this.url}/${url}`;
  }
}
