import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { World, Palier, Product } from './world';
import { WebserviceService } from './webservice.service';

export const GET_SERV = "http://localhost:4000/";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'isisCapitalist';
  server = GET_SERV;
  world: World = new World();
  constructor(private service: WebserviceService) {
    this.service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
      }
    );
  }
}
