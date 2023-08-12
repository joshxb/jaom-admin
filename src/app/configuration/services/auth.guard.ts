import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Base, Redirects } from '../configuration.component';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  base = new Base();
  private baseUrl = this.base.baseUrl;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      localStorage.clear();

      if (this.baseUrl == Redirects.localServerUrl) {
        window.location.href = Redirects.localUserUrl;
      } else {
        window.location.href = Redirects.deployUserUrl;
      }
    }
    return true;
  }
}
