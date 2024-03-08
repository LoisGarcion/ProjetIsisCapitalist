import {Component, Inject, Input, OnChanges, PLATFORM_ID, signal} from '@angular/core';
import { Product } from '../world';
import {GET_SERV} from "../app.component";
import {BigvaluePipe} from "../bigvalue.pipe";
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    BigvaluePipe,
    MatProgressBarModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnChanges {
  product: Product = new Product();
  progressbarvalue: number = 0;
  isBrowser = signal(false);

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

  calcScore() {
    //TODO ICI
  }

  startProduction() {

  }

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  ngOnChanges(): void {

  }

  protected readonly GET_SERV = GET_SERV;
}
