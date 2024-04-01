import {Component, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, signal} from '@angular/core';
import {Palier, Product} from '../world';
import {GET_SERV} from "../app.component";
import {BigvaluePipe} from "../bigvalue.pipe";
import {isPlatformBrowser} from "@angular/common";
import {MyProgressBarComponent, Orientation} from "../progressbar.component";
import {WebserviceService} from "../webservice.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    BigvaluePipe,
    MyProgressBarComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnChanges {
  product: Product = new Product();
  run: boolean = this.product.timeleft != 0;
  auto: boolean = this.product.managerUnlocked;
  initialValue: number = 0;
  isBrowser = signal(false);
  lastUpdate: number = Date.now();
  qtMultiAchat: number = 1;
  worldMoney: number = 0;
  canBuy = false;
  numberBuyable = 0;
  priceNumberBuyable = 0;
  angels = 0;
  angelBonus = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private service: WebserviceService) {
    this.isBrowser.set(isPlatformBrowser(platformId));
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      setInterval(() => { this.calcScore(); }, 100)
    }
  }

  @Input()
  set prod(value: Product) {
    console.log(value);
    this.product = value;
    console.log("vitesse : " + this.product.vitesse);
    this.auto = this.product.managerUnlocked;
    this.initialValue = this.product.vitesse - this.product.timeleft;
    this.run = this.product.timeleft != 0;
  }

  @Input()
  set qtMulti(value: number) {
    this.qtMultiAchat = value;
    this.canBuyAndHowMany();
  }

  @Input()
  set money(value: number) {
    this.worldMoney = value;
    this.canBuyAndHowMany();
  }

  @Input()
  set activeAngels(value: number) {
    this.angels = value;
  }

  @Input()
  set bonusAngels(value: number) {
    this.angelBonus = value;
  }

  @Output()
  notifyProduction: EventEmitter<[Product,number]> = new EventEmitter<[Product,number]>();

  @Output()
  onBuy: EventEmitter<[cost : number, product : Product, numberBuyed : number]> = new EventEmitter<[cost : number, product : Product, numberBuyed : number]>();

  formatMilliseconds(milliseconds: number): string { //TODO Il faut fix quelquechose ici, peut utilisé Date ou Time

    // Convert milliseconds to seconds
    let totalSeconds = Math.floor(milliseconds / 1000);

    // Calculate hours
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    // Calculate minutes
    const minutes = Math.floor(totalSeconds / 60);

    // Calculate remaining seconds
    const seconds = totalSeconds % 60;

    // Format the time components to ensure they are two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Construct the time string
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  calcScore() {
    if(this.product.timeleft!=0){
      let elapsed = Date.now() - this.lastUpdate;
      this.product.timeleft -= elapsed;
      this.lastUpdate = Date.now();
      if(this.product.timeleft <= 0){
        if(this.product.managerUnlocked){
          // + car timeleft est négatif
          let nbProd = Math.floor(-this.product.timeleft / this.product.vitesse) + 1;
          this.product.timeleft = this.product.vitesse + (this.product.timeleft%this.product.vitesse);
          this.notifyProduction.emit([this.product,nbProd]);
          this.auto = true;
        }
        else {
          this.product.timeleft = 0;
          this.notifyProduction.emit([this.product, 1]);
          this.run = false;
        }
      }
    }
  }

  startProduction(notify: boolean = true) {
    if(!this.run){
      this.initialValue = 0;
      this.product.timeleft = this.product.vitesse;
      this.run = true;
      this.lastUpdate = Date.now();
      if(notify) {
        this.service.lancerProduction(this.product).catch(reason =>
          console.log("erreur: " + reason)
        );
      }
    }
  }

  canBuyAndHowMany() {
    let totalPrice = this.calcPriceNumberBuyable(this.qtMultiAchat);
    switch (this.qtMultiAchat) {
      case 1:
        this.canBuy = this.worldMoney >= totalPrice;
        this.numberBuyable = 1;
        this.priceNumberBuyable = this.product.cout;
        break;
      case 10:
        this.canBuy = this.worldMoney >= totalPrice;
        this.numberBuyable = 10;
        this.priceNumberBuyable = totalPrice;
        break;
      case 100:
        this.canBuy = this.worldMoney >= totalPrice;
        this.numberBuyable = 100;
        this.priceNumberBuyable = totalPrice;
        break;
      case 0:
        let max = this.calcMaxNumberBuyable();
        if(max > 0){
          this.canBuy = true;
          this.numberBuyable = max;
          this.priceNumberBuyable = this.calcPriceNumberBuyable(max);
        }
        else {
          this.canBuy = false;
          this.numberBuyable = 1;
          this.priceNumberBuyable = this.product.cout;
        }
        break;
    }
  }

  calcMaxNumberBuyable() {
    let numberOfItems = Math.floor(Math.log(1 + (this.worldMoney * (this.product.croissance - 1) / this.product.cout)) / Math.log(this.product.croissance));
    return Math.floor(numberOfItems);
  }

  calcPriceNumberBuyable(number: number) {
    let result = this.product.cout * (1 - Math.pow(this.product.croissance, number)) / (1 - this.product.croissance);
    return Number(result.toFixed(2));
  }

  buy(){
    if(this.canBuy){
      let total = this.priceNumberBuyable;
      this.product.quantite += this.numberBuyable;
      this.worldMoney -= total;
      this.product.cout = this.product.cout * Math.pow(this.product.croissance, this.numberBuyable);
      this.onBuy.emit([total, this.product, this.numberBuyable]);
      this.service.acheterQtProduit(this.product,this.numberBuyable).then(result => console.log(result)).catch(reason =>
        console.log("erreur: " + reason)
      );
    }
  }

  calcUpgrade(unlock: Palier) {
    console.log("Le type est : " + unlock.typeratio + " et le ratio est : " + unlock.ratio);
    if(unlock.typeratio === "vitesse"){
      this.product.vitesse = Math.round(this.product.vitesse / unlock.ratio);
      console.log("La vitesse est maintenant de : " + this.product.vitesse);
      this.product.timeleft = this.product.timeleft / unlock.ratio;
      this.initialValue = this.product.vitesse - this.product.timeleft;
    }
    else if(unlock.typeratio === "gain"){
      this.product.revenu = this.product.revenu * unlock.ratio;
      console.log("Le revenu est maintenant de : " + this.product.revenu);
    }
  }

  notifyManagerBought(){
    if(this.product.timeleft === 0){
      this.startProduction(false);
    }
  }

  ngOnChanges(): void {

  }

  protected readonly GET_SERV = GET_SERV;
  protected readonly Orientation = Orientation;
  protected readonly String = String;
}
