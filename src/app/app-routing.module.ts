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
import { ConfigurationsComponent } from './main/user-management/configurations/configurations.component';
import { DonationsComponent } from './main/transactions/donations/donations.component';
import { PageVisitsComponent } from './main/analytics/page-visits/page-visits.component';
import { UserHistoryComponent } from './main/user-management/user-history/user-history.component';
import { DonationsInfoComponent } from './main/modifications/donations-info/donations-info.component';
import { ContactDetailsComponent } from './main/modifications/contact-details/contact-details.component';
import { FaqsComponent } from './main/modifications/faqs/faqs.component';
import { FeedbackComponent } from './main/feedback/feedback.component';
import { SecurityComponent } from './main/security/security.component';
import { SettingsComponent } from './main/settings/settings.component';
import { NewAdminComponent } from './main/new-admin/new-admin.component';
import { AdminAccessComponent } from './main/admin-access/admin-access.component';
import { OffersComponent } from './main/user-management/offers/offers.component';
import { ContactsComponent } from './main/user-management/contacts/contacts.component';
import { NotFoundComponent } from './not-found/not-found.component';

const userManagementChildren: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'chats', component: ChatsComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'updates', component: UpdatesComponent },
  { path: 'todos', component: TodoComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'prayer-offers', component: OffersComponent },
  { path: 'configurations', component: ConfigurationsComponent },
  { path: 'user-history', component: UserHistoryComponent },
];

const modificationsChildren: Routes = [
  { path: 'donations-info', component: DonationsInfoComponent },
  { path: 'contact-details', component: ContactDetailsComponent },
  { path: 'faqs', component: FaqsComponent },
];

const routes: Routes = [
  {
    path: 'process-login',
    component: ProcessLoginComponent,
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
    path: 'transactions/donations',
    component: DonationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics/page-visits',
    component: PageVisitsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management',
    children: userManagementChildren,
    canActivate: [AuthGuard],
  },
  {
    path: 'modifications',
    children: modificationsChildren,
    canActivate: [AuthGuard],
  },
  {
    path: 'feedbacks',
    component: FeedbackComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'security-control',
    component: SecurityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-admin',
    component: NewAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configure-access',
    component: AdminAccessComponent,
    canActivate: [AuthGuard],
  },

  //not found page
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
