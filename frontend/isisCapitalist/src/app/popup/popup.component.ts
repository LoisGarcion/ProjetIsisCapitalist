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

@Component({
  templateUrl: './popup.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatButtonModule, MatDialogActions, MatDialogClose, ProductComponent],
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  constructor(public ref: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: WebserviceService) {
  }

  protected readonly GET_SERV = GET_SERV;
  protected readonly Product = Product;

  @Output() notifyBuyManager: EventEmitter<Palier> = new EventEmitter<Palier>();

  getProductNameById(idcible: number) {
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
}
