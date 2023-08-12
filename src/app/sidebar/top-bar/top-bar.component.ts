import { AuthService } from './../../configuration/services/auth.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { imageUrls } from 'src/app/app.component';
import { Base, Redirects } from 'src/app/configuration/configuration.component';
import { AdminService } from 'src/app/configuration/services/admin.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit{
  imageUrls = new imageUrls();
  settingsVisible = false;
  @ViewChild('profile_logo')
  profile_logo!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private authService: AuthService,
    private adminService : AdminService
  ) {}

  base = new Base();
  private baseUrl = this.base.baseUrl;
  public data : any;

  ngOnInit() {
    this.adminService.getUserData().subscribe((response) => {
      this.data = response;
    });
  }

  logOut() {
    this.authService.logout();
    alert(this.baseUrl);
    if (this.baseUrl == Redirects.localServerUrl) {
      window.location.href = Redirects.localUserUrl;
    } else {
      window.location.href = Redirects.deployUserUrl;
    }
  }
}
