import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class InfoComponent {
  identity = {
    nom: '',
    prenom: '',
    numCarte: '',
    dateNaissance: '',
    dateFinCarte: '',
    adresse: '',
  };

  canModify = false;
  isToastVisible = false;

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation State:', navigation?.extras?.state);
    if (navigation?.extras?.state) {
      this.identity = navigation.extras.state as {
        nom: string;
        prenom: string;
        numCarte: string;
        dateNaissance: string;
        dateFinCarte: string;
        adresse: string;
      };
    }
  }

  validate(): void {
    const apiUrl = 'http://localhost:8085/api/carteIdentite';
    const requestBody = {
      nom: this.identity.nom,
      prenom: this.identity.prenom,
      numeroCarteNational: this.identity.numCarte,
      dateNaissance: this.identity.dateNaissance,
      dateFinCarteNational: this.identity.dateFinCarte,
      adresse: this.identity.adresse,
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
