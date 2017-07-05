import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard',component: DashboardComponent },
  { path: 'register',component: RegisterComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    
  ],
  imports: [ RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )],
  providers: [],
  bootstrap: [],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }
