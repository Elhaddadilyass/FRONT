// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Import RouterModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Make AppComponent standalone
  imports: [RouterModule]  // Import RouterModule so that router-outlet is recognized
})
export class AppComponent {
  title = 'FRONT';
  message = 'Welcome to the Angular app!';  // Example message
}
