import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.deployment';

@Component({
  selector: 'app-configuration',
  template: '',
})
export class Configuration implements OnInit {
  ngOnInit(): void {
  }

  setCollapseCookie(cookieValue: string) {
    // Set the name, value, and expiration time of the cookie
    const cookieName = 'collapse-mode';
    const expirationDays = 7;
    // Set the expiration date of the cookie
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + expirationDays * 24 * 60 * 60 * 1000
    );
    // Set the cookie with the specified name, value, and expiration date
    document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
  }
}

export enum ApiUrls {
  ContentType = 'application/json',
  Accept = 'application/json',
}

export class Base {
  baseUrl =  localStorage.getItem('baseUrl') ?
  localStorage.getItem('baseUrl') :
  environment.baseUrl;//initialize during deployment

  suffixUrl = 'api';
}

export class PusherCredentials {
  cred = '01a8b159fe93da3fed94';
  cluster = 'ap1';
  channel = 'chat';
  event = 'message';
}
