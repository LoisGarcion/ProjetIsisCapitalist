import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent, MatDialogRef, MatDialogActions, MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {Palier, Product, World} from "../world";
import {GET_SERV} from "../app.component";
import {ProductComponent} from "../product/product.component";
import {WebserviceService} from "../webservice.service";

export interface DialogData {
  world: World;
  popupPurpose: string; //example : managers, upgrades, ...
}

@Component({ //TODO Y'a un probleme avec le product associé à un manager
  templateUrl: './popup.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatButtonModule, MatDialogActions, MatDialogClose, ProductComponent],
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  unlocks: Palier[];
  constructor(public ref: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: WebserviceService) {
    this.unlocks = this.getListUnlocks();
  }

  protected readonly GET_SERV = GET_SERV;

  @Output() notifyBuyManager: EventEmitter<Palier> = new EventEmitter<Palier>();

  getProductNameById(idcible: number) {
    if(idcible === 0){
      return "all";
    }
    if(this.data.world.products !== undefined && idcible !== undefined) {
      const product = this.data.world.products.find(p => p.id === idcible);
      if (product !== undefined) {
        return product.name;
      }
    }
    return "Unknown product";
  }

  buyManager(manager: Palier) {
    this.notifyBuyManager.emit(manager);
    this.service.engagerManager(manager).catch(reason => console.log("erreur : " + reason));
  }

  getListUnlocks(){
    console.log("Je récupère les unlocks")
    let listUnlocks = [];
    if(this.data.world.products !== undefined) {
      for(let product of this.data.world.products) {
        if(product.paliers !== null){
          console.log(product.paliers)
          for(let unlock of product.paliers) {
            if (!unlock.unlocked) {
              listUnlocks.push(unlock);
            }
          }
        }
      }
    }
    for(let palier of this.data.world.allunlocks){
      if(!palier.unlocked){
        listUnlocks.push(palier);
      }
    }
    return listUnlocks;
  }
}
