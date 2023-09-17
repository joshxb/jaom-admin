import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LeftBarComponent } from './sidebar/left-bar/left-bar.component';
import { SidebarToggleDirective } from './sidebar-toggle.directive';
import { DatePipe } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './configuration/services/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopBarComponent } from './sidebar/top-bar/top-bar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ProcessLoginComponent } from './process-login/process-login.component';
import { UsersComponent } from './main/user-management/users/users.component';
import { ModalComponent } from './main/modal/modal.component';
import { ChatsComponent } from './main/user-management/chats/chats.component';
import { RoomsComponent } from './main/user-management/rooms/rooms.component';
import { UpdatesComponent } from './main/user-management/updates/updates.component';
import { TodoComponent } from './main/user-management/todo/todo.component';
import { ConfigurationsComponent } from './main/user-management/configurations/configurations.component';
import { DonationsComponent } from './main/transactions/donations/donations.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PageVisitsComponent } from './main/analytics/page-visits/page-visits.component';
import { UserHistoryComponent } from './main/user-management/user-history/user-history.component';
import { DonationsInfoComponent } from './main/modifications/donations-info/donations-info.component';
import { ContactDetailsComponent } from './main/modifications/contact-details/contact-details.component';
import { FaqsComponent } from './main/modifications/faqs/faqs.component';
import { FeedbackComponent } from './main/feedback/feedback.component';
import { JsonDecodePipe } from './pipes/json-decode.pipe';
import { SecurityComponent } from './main/security/security.component';
import { SettingsComponent } from './main/settings/settings.component';
import { NewAdminComponent } from './main/new-admin/new-admin.component';
import { AdminAccessComponent } from './main/admin-access/admin-access.component';
import { OffersComponent } from './main/user-management/offers/offers.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LeftBarComponent,
    SidebarToggleDirective,
    TopBarComponent,
    ProcessLoginComponent,
    UsersComponent,
    ModalComponent,
    ChatsComponent,
    RoomsComponent,
    UpdatesComponent,
    TodoComponent,
    ConfigurationsComponent,
    DonationsComponent,
    PageVisitsComponent,
    UserHistoryComponent,
    DonationsInfoComponent,
    ContactDetailsComponent,
    FaqsComponent,
    FeedbackComponent,
    JsonDecodePipe,
    SecurityComponent,
    SettingsComponent,
    NewAdminComponent,
    AdminAccessComponent,
    OffersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2ImgMaxModule,
    FormsModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    MatDialogModule,
  ],
  exports: [NgModel],

  providers: [AuthGuard, DatePipe, DeviceDetectorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
