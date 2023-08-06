import { Component } from '@angular/core';
import { imageUrls } from 'src/app/app.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  imageUrls = new imageUrls();
}
