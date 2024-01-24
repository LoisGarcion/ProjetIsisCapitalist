import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { World, Palier, Product } from './world';
import { WebserviceService } from './webservice.service';
import { FormsModule } from '@angular/forms';

export const GET_SERV = "http://localhost:4000/";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'isisCapitalist';
  server = GET_SERV;
  world: World = new World();
  username: string = localStorage.getItem('username')?.toString() ?? Math.floor(Math.random()*100000).toString();

  onUsernameChanged(){
    if(this.username == ""){
      this.username = Math.floor(Math.random()*100000).toString();
    }
    localStorage.setItem('username', this.username);
    console.log("test")
  }

  constructor(private service: WebserviceService) {
    this.service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
      }
    );
  }
}
