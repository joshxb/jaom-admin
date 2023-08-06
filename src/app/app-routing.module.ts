import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AuthGuard } from './configuration/services/auth.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivate: [AuthGuard]
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
