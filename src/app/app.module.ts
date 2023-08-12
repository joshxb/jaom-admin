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

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LeftBarComponent,
    SidebarToggleDirective,
    TopBarComponent
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
    CanvasJSAngularChartsModule
  ],
  exports: [NgModel],

  providers: [AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
