import { Component, Input, OnChanges } from '@angular/core';
import { Product } from '../world';
import {GET_SERV} from "../app.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnChanges {
  product: Product = new Product();
  constructor() {
  }

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  ngOnChanges(): void {

  }

  protected readonly GET_SERV = GET_SERV;
}
