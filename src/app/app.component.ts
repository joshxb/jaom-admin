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
  logo: string = './../assets/favicon.png';
  search: string = './../assets/search.png';
  notify: string = './../assets/notify.png';
  collapse: string = './../assets/homebar.png';
  home: string = './../assets/home.png';
  chat: string = './../assets/chat.png';
  room: string = './../assets/room.png';
  update: string = './../assets/updates.png';
  todo: string = './../assets/todo.png';
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
}
