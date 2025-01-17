import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.css'],
  standalone: true,
})
export class PassportComponent {
  identity = {
    id:'',
    Passport_Number:'',
    Nom:'',
    Prenom:'',
    Nationalite:'',
    dateDeDeliverance:'',
    dateExpiration:'',
    dateNaissance:'',
    LieuNaissance:'',
  };

  canModify = false;
  isToastVisible = false;

  constructor(private router: Router) {}

  validate(): void {
    this.isToastVisible = true;
    setTimeout(() => {
      this.isToastVisible = false;
      alert("traitement valider");
      this.router.navigate(['/home']);
    }, 1000); // Hide toast after 3 seconds
  }

  toggleModify(): void {
    this.canModify = !this.canModify;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}

