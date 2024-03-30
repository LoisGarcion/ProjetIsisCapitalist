import { Injectable } from '@angular/core';
import { createClient, fetchExchange } from '@urql/core';
import {ACHETER_CASH_UPGRADE, ACHETER_QT_PRODUIT, ENGAGER_MANAGER, GET_WORLD, LANCER_PRODUCTION} from '../graphrequest';
import { GET_SERV } from './app.component';
import {Palier, Product} from "./world";

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

  lancerProduction(product: Product) {
    return this.createClient().mutation(LANCER_PRODUCTION, { id:
      product.id}).toPromise();
  }

  engagerManager(manager: Palier){
    return this.createClient().mutation(ENGAGER_MANAGER, { name: manager.name }).toPromise();
  }

  acheterQtProduit(product: Product, quantite: number){
    return this.createClient().mutation(ACHETER_QT_PRODUIT, { id: product.id, quantite: quantite }).toPromise();
  }

  constructor() { }

  acheterCashUpgrade(upgrade: Palier) {
    return this.createClient().mutation(ACHETER_CASH_UPGRADE, { name: upgrade.name }).toPromise();
  }
}
