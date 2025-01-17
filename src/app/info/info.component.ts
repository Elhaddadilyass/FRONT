import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  standalone: true,
})
export class InfoComponent {
  identity = {
    lastName: 'Doe',
    firstName: 'John',
    cin: 'L12345678',
    expirationDate: '2030-01-01',
    address: '123 Main Street',
    dob: '1990-01-01',
  };

  canModify = false;
  isToastVisible = false;

  constructor(private router: Router) {}

  validate(): void {
    this.isToastVisible = true;
    setTimeout(() => {
      this.isToastVisible = false;
      alert("traitement valider");
      this.router.navigate(['/']);
    }, 1000); // Hide toast after 3 seconds
  }

  toggleModify(): void {
    this.canModify = !this.canModify;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
