import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AuthGuard } from './configuration/services/auth.guard';
import { ProcessLoginComponent } from './process-login/process-login.component';
import { UsersComponent } from './main/user-management/users/users.component';
import { ChatsComponent } from './main/user-management/chats/chats.component';
import { RoomsComponent } from './main/user-management/rooms/rooms.component';
import { UpdatesComponent } from './main/user-management/updates/updates.component';
import { TodoComponent } from './main/user-management/todo/todo.component';

const routes: Routes = [
  {
    path: 'process-login',
    component: ProcessLoginComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management/users',
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management/chats',
    component: ChatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management/rooms',
    component: RoomsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management/updates',
    component: UpdatesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management/todos',
    component: TodoComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
