// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { PassportComponent} from './passport/passport.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },  // Route for HomeComponent
  { path: 'info', component: InfoComponent },
  {path: 'passport', component: PassportComponent},// Route for InfoComponent
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Default route
];
