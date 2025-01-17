// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';  // Import InfoComponent
import { PassportComponent} from './passport/passport.component';

@NgModule({
  declarations: [
    AppComponent,  // Keep AppComponent as the bootstrap component
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // Add RouterModule to imports for routing
    HomeComponent,  // Add HomeComponent here
    InfoComponent,
    PassportComponent,// Add InfoComponent here
  ],
  providers: [],
  bootstrap: [AppComponent] // AppComponent remains the bootstrap component
})
export class AppModule {}
