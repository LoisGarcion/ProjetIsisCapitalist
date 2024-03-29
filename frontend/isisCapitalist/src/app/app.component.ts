import {AfterViewInit, Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { World, Palier, Product } from './world';
import { WebserviceService } from './webservice.service';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import {BigvaluePipe} from "./bigvalue.pipe";
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent, DialogData } from './popup/popup.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButton} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";

export const GET_SERV = "http://localhost:4000/";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ProductComponent, BigvaluePipe, MatSnackBarModule, MatButton, MatBadge],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  title = 'isisCapitalist';
  server = GET_SERV;
  world: World = new World();
  username: string = localStorage.getItem('username')?.toString() ?? Math.floor(Math.random()*100000).toString();
  qtMulti: number = 1;
  managerBadge: number = 0;
  @ViewChildren(ProductComponent) productsComponent: QueryList<ProductComponent> | undefined;

  setMatBadge(){
    this.managerBadge = this.world.managers.filter(m => m.seuil <= this.world.money && !m.unlocked).length;
  }

  onUsernameChanged(){
    if(this.username == ""){
      this.username = Math.floor(Math.random()*100000).toString();
    }
    localStorage.setItem('username', this.username);
    this.service.getWorld().then(
      world => {
        console.log(world);
        this.world = world.data.getWorld;
        window.location.reload();
      }
    );
  }

  constructor(private service: WebserviceService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.service.getWorld().then(
      world => {
        console.log(world);
        this.world = world.data.getWorld;
        this.setMatBadge();
      }
    );
  }
  onProductionDone(event : [Product, number]){
    this.world.money = this.world.money + event[0].revenu * event[0].quantite * event[1];
    this.setMatBadge();
  }

  onBuy(event: [cost: number, product: Product, numberBuyed: number]){
    this.world.money -= event[0];

    //Check si on a un unlock lié au produit
    if(event[1].paliers.length > 0){
      for(let palier of event[1].paliers.filter(p => p.seuil <= event[1].quantite && !p.unlocked)){
        palier.unlocked = true;
        this.snackBar.open("Vous avez débloqué l'unlock "+ palier.name +  " !", "", {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.productsComponent?.find(p => p.product.id === event[1].id)?.calcUpgrade(palier);
      }
    }

    //Check si on a des allunlocks
    if(this.world.allunlocks.length > 0){
    for(let palier of this.world.allunlocks.filter(p => p.seuil <= event[1].quantite && !p.unlocked)){
        let unlockPallier = true;
        for (let product of this.world.products) {
          if (product.quantite < palier.seuil){
            unlockPallier = false;
            break;
          }
        }
        if(unlockPallier){
          palier.unlocked = true;
          this.snackBar.open("Vous avez débloqué l'unlock " + palier.name + " !", "", {
            duration: 2000,
            verticalPosition: 'top'
          });
          if(this.productsComponent !== undefined) {
            for (let product of this.productsComponent) {
              product.calcUpgrade(palier);
            }
          }
        }
      }
    }
    this.setMatBadge();
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
  openPopup(purpose: string, ) {
    console.log(this.world.products);
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {world: this.world, popupPurpose: purpose},
      width: '60%'
    });
    dialogRef.componentInstance.notifyBuyManager.subscribe((manager: Palier) => {
      const manIndex = this.world.managers.findIndex(m => m.name === manager.name);
      let man = this.world.managers[manIndex];
      const prodIndex = this.world.products.findIndex(p => p.id === man.idcible);
      if (manIndex !== -1) {
        this.world.managers[manIndex].unlocked = true;
        this.world.money -= man.seuil
        this.world.products[prodIndex].managerUnlocked = true;
        this.snackBar.open("Le manager " + this.world.managers[manIndex].name + " a bien été acheté !", "", {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.productsComponent?.find(p => p.product.id === man.idcible)?.notifyManagerBought();
      }
      this.setMatBadge();
    });
  }
}
