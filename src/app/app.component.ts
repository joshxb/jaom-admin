import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.deployment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-test';

  apiUrl!: string;

  ngOnInit() {
    this.apiUrl = environment.baseUrl;
    localStorage.setItem('baseUrl', this.apiUrl);
  }
}

export class imageUrls {
  favicon: string = './../assets/favicon.png';
  analytics: string = './../assets/analytics.png';
  logo: string = './../assets/favicon.png';
  search: string = './../assets/search.png';
  notify: string = './../assets/notify.png';
  collapse: string = './../assets/homebar.png';
  dash: string = './../assets/home.png';
  chat: string = './../assets/chat.png';
  user_management: string = './../assets/room.png';
  update: string = './../assets/updates.png';
  trans: string = './../assets/todo.png';
  faqs: string = './../assets/faqs.png';
  settings: string = './../assets/settings.png';
  user_default: string = './../assets/default_user.png';
  qr_image: string = './../assets/qr.png';
  default_upload_img: string = './../assets/default_upload.png';
  view: string = './../assets/view.png';
  v_ellipses: string = './../assets/v-ellipses.png';
  add: string = './../assets/add.png';
  arrow_down: string = './../assets/arrow-down.png';
  delete: string = './../assets/delete.png';
  info: string = './../assets/info.png';
  due: string = './../assets/due.png';
  edit: string = './../assets/edit.png';
  edit_updates: string = './../assets/edit-updates.png';
  message : string = './../assets/message.png';
  security : string = './../assets/security.png';
  logout : string = './../assets/logout.png';
  totalUser : string = './../assets/totalUser.png';
  arrowRight : string = './../assets/arrow-right.png';
  allChat : string = './../assets/allChat.png';
  updateChats : string = './../assets/updateChats.png';
  editUsers : string = './../assets/edit-users.png';
}
