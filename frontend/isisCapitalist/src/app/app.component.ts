import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { World, Palier, Product } from './world';
import { WebserviceService } from './webservice.service';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import {BigvaluePipe} from "./bigvalue.pipe";
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent, DialogData } from './popup/popup.component';

export const GET_SERV = "http://localhost:4000/";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ProductComponent, BigvaluePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'isisCapitalist';
  server = GET_SERV;
  world: World = new World();
  username: string = localStorage.getItem('username')?.toString() ?? Math.floor(Math.random()*100000).toString();
  qtMulti: number = 1;


  onUsernameChanged(){
    if(this.username == ""){
      this.username = Math.floor(Math.random()*100000).toString();
    }
    localStorage.setItem('username', this.username);
    this.service.getWorld().then(
      world => {
        console.log(world);
        this.world = world.data.getWorld;
      }
    );
  }

  constructor(private service: WebserviceService, public dialog: MatDialog){
    this.service.getWorld().then(
      world => {
        console.log(world);
        this.world = world.data.getWorld;
      }
    );
  }

  onProductionDone(product: Product){
    this.world.money = this.world.money + product.revenu * product.quantite;
  }

  onBuy(total: number){
    this.world.money -= total;
  }

  changeQt(){
    //Ici on renvoie un nombre, donc pour le cas max on considère que c'est 0
    switch(this.qtMulti){
      case 1:
        this.qtMulti = 10;
        break;
      case 10:
        this.qtMulti = 100;
        break;
      case 100:
        this.qtMulti = 0;
        break;
      case 0:
        this.qtMulti = 1;
        break;
    }
  }
  openPopup(purpose: string){
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {world: this.world, popupPurpose: purpose},
      width: '60%'
    });
  }
}
