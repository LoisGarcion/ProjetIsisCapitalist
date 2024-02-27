import { Injectable } from '@angular/core';
import { createClient, fetchExchange } from '@urql/core';
import { GET_WORLD } from '../graphrequest';
import { GET_SERV } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class WebserviceService {
//le serveur est dans appcomponent.ts pour pouvoir le réutiliser partout
  user = localStorage.getItem('username')?.toString() ?? Math.floor(Math.random()*100000).toString();
  createClient() {
    return createClient({
      url: GET_SERV + "graphql",
      exchanges : [fetchExchange],
      fetchOptions: () => {
        return {
          headers: { 'x-user': this.user },
        };
      },
    });
  }

  getWorld() {
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }

  constructor() { }
}
