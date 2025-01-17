import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import {Router, RouterModule} from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true, // Keep this for standalone component
  imports: [CommonModule, RouterModule] // Import CommonModule
})
export class HomeComponent {
  selectedFile: File | null = null;
  successMessage: string = '';
  selectedAction: string | null = null; // Variable to store the selected route

  constructor(private router: Router) {}

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.successMessage = '';
    }
  }

  goToNext(): void {
    if (this.selectedFile) {
      this.selectedAction = '/info'; // Set route to navigate to InfoComponent
      this.successMessage = `Click Continue to proceed!`;
    }
  }

  // Set route for "Passport"
  goToPassport(): void {
    if (this.selectedFile) {
      this.selectedAction = '/passport'; // Set route to navigate to PassportComponent
      this.successMessage = `Click Continue to proceed!`;
    }
  }

  // Navigate to the selected route
  proceed(): void {
    if (this.selectedAction) {
      this.router.navigate([this.selectedAction]); // Navigate to the route stored in selectedAction
    }
  }

  // Delete the selected file
  deleteFile(): void {
    this.selectedFile = null;
    this.successMessage = '';
  }
}
