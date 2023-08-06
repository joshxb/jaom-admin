import { Component } from '@angular/core';
import { imageUrls } from 'src/app/app.component';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css', './../../../styles.css'],
})
export class LeftBarComponent {
  imageUrls = new imageUrls();
}
