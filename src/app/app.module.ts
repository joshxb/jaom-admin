import { NgModule } from '@angular/core'; // Importing NgModule from Angular's core module

// Importing necessary modules for the Angular app
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

// Importing components, directives, pipes, and services used in the app
import { AppComponent } from './app.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LeftBarComponent } from './sidebar/left-bar/left-bar.component';
import { SidebarToggleDirective } from './sidebar-toggle.directive';
import { TopBarComponent } from './sidebar/top-bar/top-bar.component';
import { ProcessLoginComponent } from './process-login/process-login.component';
import { UsersComponent } from './main/user-management/users/users.component';
import { ModalComponent } from './main/modal/modal.component';
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
import { JsonDecodePipe } from './pipes/json-decode.pipe';
import { SecurityComponent } from './main/security/security.component';
import { SettingsComponent } from './main/settings/settings.component';
import { NewAdminComponent } from './main/new-admin/new-admin.component';
import { AdminAccessComponent } from './main/admin-access/admin-access.component';
import { OffersComponent } from './main/user-management/offers/offers.component';
import { SpinnerLoadingComponent } from './common/assets/spinner-loading/spinner-loading.component';
import { ContactsComponent } from './main/user-management/contacts/contacts.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@NgModule({
  declarations: [
    // Declaring the components, directives, and pipes used in the app
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
    SpinnerLoadingComponent,
    ContactsComponent,
    NotFoundComponent
  ],
  imports: [
    // Importing the necessary Angular modules
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
    MatProgressBarModule,
    MatSelectModule
  ],
  exports: [NgModel], // Exporting NgModel for usage in other components

  providers: [
    // Providing the necessary services for dependency injection
    AuthGuard,
    DatePipe,
    DeviceDetectorService
  ],
  bootstrap: [AppComponent] // Bootstrapping the AppComponent
})
export class AppModule {}
