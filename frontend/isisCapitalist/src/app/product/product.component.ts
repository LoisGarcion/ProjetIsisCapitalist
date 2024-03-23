import {Component, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, signal} from '@angular/core';
import {Product} from '../world';
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
    this.product = value;
    this.run = this.product.timeleft != 0;
    this.auto = this.product.managerUnlocked;
    this.initialValue = this.product.timeleft;
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

  @Output()
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  @Output()
  onBuy: EventEmitter<number> = new EventEmitter<number>();

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
          this.product.timeleft = this.product.vitesse + this.product.timeleft;
          this.notifyProduction.emit(this.product);
          this.auto = true;
        }
        else {
          this.product.timeleft = 0;
          this.notifyProduction.emit(this.product);
          this.run = false;
        }
      }
    }
  }

  startProduction() {
    if(!this.run){
      this.product.timeleft = this.product.vitesse;
      this.run = true;
      this.lastUpdate = Date.now();
      this.service.lancerProduction(this.product).catch(reason =>
        console.log("erreur: " + reason)
      );
      this.initialValue = 0;
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
      this.onBuy.emit(total);
      this.service.acheterQtProduit(this.product,this.numberBuyable).then(result => console.log(result)).catch(reason =>
        console.log("erreur: " + reason)
      );
    }
  }

  ngOnChanges(): void {

  }

  protected readonly GET_SERV = GET_SERV;
  protected readonly Orientation = Orientation;
}
