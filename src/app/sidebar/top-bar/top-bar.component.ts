import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { imageUrls } from 'src/app/app.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  imageUrls = new imageUrls();
  settingsVisible = false;
  @ViewChild('profile_logo')
  profile_logo!: ElementRef;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngOnInit() {
    
  }
}
