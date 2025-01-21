import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class PassportComponent {
  identity = {
    passportNumber: '',
    nom: '',
    prenom: '',
    nationalite: '',
    dateDeDeliverance: '',
    dateExpiration: '',
    dateNaissance: '',
    lieuNaissance: '',
  };

  canModify = false;
  isToastVisible = false;

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation State:', navigation?.extras?.state);
    if (navigation?.extras?.state) {
      this.identity = navigation.extras.state as {
        passportNumber: string;
        nom: string;
        prenom: string;
        nationalite: string;
        dateDeDeliverance: string;
        dateExpiration: string;
        dateNaissance: string;
        lieuNaissance: string;
      };
    }
  }

  validate(): void {
    const apiUrl = 'http://localhost:8085/api/passport';
    const requestBody = {
      passportNumber: this.identity.passportNumber,
      nom: this.identity.nom,
      prenom: this.identity.prenom,
      nationalite: this.identity.nationalite,
      dateDeDeliverance: this.identity.dateDeDeliverance,
      dateExpiration: this.identity.dateExpiration,
      dateNaissance: this.identity.dateNaissance,
      lieuNaissance: this.identity.lieuNaissance,
    };

    this.http.post(apiUrl, requestBody).subscribe(
      (response) => {
        console.log('Response:', response);
        this.isToastVisible = true;
        setTimeout(() => {
          this.isToastVisible = false;
          alert('Les données ont été enregistrées avec succès !');
          this.router.navigate(['/home']);
        }, 1000);
      },
      (error) => {
        console.error('Error:', error);
        alert("Une erreur s'est produite lors de l'enregistrement des données.");
      }
    );
  }

  toggleModify(): void {
    this.canModify = !this.canModify;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
