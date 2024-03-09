import {Component, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, signal} from '@angular/core';
import {Product} from '../world';
import {GET_SERV} from "../app.component";
import {BigvaluePipe} from "../bigvalue.pipe";
import {isPlatformBrowser} from "@angular/common";
import {MyProgressBarComponent, Orientation} from "../progressbar.component";

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
  initialValue: number = this.product.timeleft;
  isBrowser = signal(false);
  lastUpdate: number = Date.now();
  qtMultiAchat: number = 1;
  worldMoney: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.isBrowser.set(isPlatformBrowser(platformId));
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      setInterval(() => { this.calcScore() }, 100)
    }
  }

  formatMilliseconds(milliseconds: number): string {
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
        this.product.timeleft = 0;
        this.notifyProduction.emit(this.product);
        this.run = false;
      }
    }
  }

  startProduction() {
    if(this.run == false){
      this.run = true;
      this.product.timeleft = this.product.vitesse;
      this.lastUpdate = Date.now();
    }
  }

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Input()
  set qtMulti(value: number) {
    this.qtMultiAchat = value;
  }

  @Input()
  set money(value: number) {
    this.worldMoney = value;
  }

  @Output()
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  ngOnChanges(): void {

  }

  protected readonly GET_SERV = GET_SERV;
  protected readonly Orientation = Orientation;
}
