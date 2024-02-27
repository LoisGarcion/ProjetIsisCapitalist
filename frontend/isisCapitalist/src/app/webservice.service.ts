import { Injectable } from '@angular/core';
import { createClient, fetchExchange } from '@urql/core';
import { GET_WORLD } from '../Graphrequest'; // Add the missing import statement
import { GET_SERV } from './app.component';
let user = ''; //IL FAT RECUPER CELUI DE APP COMPONENT
@Injectable({
  providedIn: 'root'
})

export class WebserviceService {
//le serveur est dans appcomponent.ts pour pouvoir le réutiliser partout
  
  createClient() {
    return createClient({
      url: GET_SERV + "graphql",
      exchanges : [fetchExchange],
      fetchOptions: () => {
        return {
          headers: { 'x-user': user },
        };
      },
    });
  }

  getWorld() {
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }

  constructor() { }
}
