import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router, RouterModule } from '@angular/router'; // Import Router for navigation
import { HttpClient } from '@angular/common/http';

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
  isLoading: boolean = false; // Loading state

  constructor(private http: HttpClient, private router: Router) {}

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

  goToPassport(): void {
    if (this.selectedFile) {
      this.selectedAction = '/passport'; // Set route to navigate to PassportComponent
      this.successMessage = `Click Continue to proceed!`;
    }
  }

  /***************************************************************/

  extractWords(response: any): string[] {
    const words: string[] = [];

    if (Array.isArray(response) && response.length > 0) {
      const items = response[0]?.items || [];
      items.forEach((item: any) => {
        item.blocks?.forEach((block: any) => {
          block.lines?.forEach((line: any) => {
            line.words?.forEach((word: any) => {
              if (word.value) {
                words.push(word.value);
              }
            });
          });
        });
      });
    }

    return words;
  }

  extractPassportNumber(words: string[]): string {
    // Indices entre lesquels chercher
    const startIndex = 16;
    const endIndex = 24;

    const passportRegex = /^[A-Z]{2}[A-Z0-9]{7}$/;

    return words
      .slice(startIndex, endIndex + 1) // Limiter la recherche aux mots entre ces indices
      .find((word) => passportRegex.test(word)) || '';
  }

  extractPassportNameAndFirstName(words: string[]): { nom: string; prenom: string } {
    const startIndex = 20;
    const endIndex = 34;

    const uppercaseWords = words
      .slice(startIndex, endIndex + 1)
      .filter((word) => /^[A-Z]{4,}$/.test(word));

    const nom = uppercaseWords[0] || '';
    const prenom = uppercaseWords[1] || '';

    return { nom, prenom };
  }

  extractPassportDates(words: string[]): { dateNaissance: string; dateDeDeliverance: string; dateExpiration: string } {
    const dateRegex = /\b\d{1,2}[./]?\d{1,2}[./]?\d{2,4}\b/;

    const potentialDates = words.filter((word) => {
      return dateRegex.test(word) && word.replace(/[./]/g, '').length >= 8 && word.replace(/[./]/g, '').length <= 10;
    });

    const formattedDates = potentialDates.map((date) => {
      const parts = date.split(/[./]/);

      if (parts.length === 1 && date.length >= 8) {
        return `${date.slice(0, 2)}.${date.slice(2, 4)}.${date.slice(4)}`;
      } else if (parts.length === 3) {
        return parts.map((part) => part.padStart(2, '0')).join('.');
      }

      return date;
    });

    const dateNaissance = formattedDates[0] || '';
    const dateDeDeliverance = formattedDates[1] || '';
    const dateExpiration = formattedDates[2] || '';

    return { dateNaissance, dateDeDeliverance, dateExpiration };
  }

  extractNameAndFirstName(words: string[]): { nom: string; prenom: string } {
    const startIndex = 6;

    const uppercaseWords = words
      .slice(startIndex + 1)
      .filter((word) => /^[A-Z]+$/.test(word) && word.length > 3);

    const nom = uppercaseWords[0] || '';
    const prenom = uppercaseWords[1] || '';

    return { nom, prenom };
  }

  extractDate(words: string[], type: 'birth' | 'expiry'): string {
    const dateRegex = /\b\d{2}[./-]\d{2}[./-]\d{4}\b/;
    const matches = words.filter((word) => dateRegex.test(word));

    if (type === 'birth') {
      return matches[0] || '';
    } else if (type === 'expiry') {
      return matches[1] || '';
    }

    return '';
  }

  extractNationalId(words: string[]): string {
    const idRegex = /^[A-Z][A-Za-z0-9]{6,7}$/;

    const isValidId = (word: string) => idRegex.test(word) && /\d/.test(word);

    const filteredWords = words.slice(20);

    return filteredWords.find(isValidId) || '';
  }

  extractAddress(words: string[]): string {
    const startIndex = 14;
    const endIndex = 28;

    const addressWords = words.slice(startIndex, endIndex + 1).filter(
      (word) => /^[A-Z]+$/.test(word) && word.length > 2
    );

    return addressWords.join(' ');
  }

  // Send file to OCR API
  proceed(): void {
    if (this.selectedFile) {
      this.isLoading = true; // Start loading animation
      const formData = new FormData();
      formData.append('files', this.selectedFile);

      this.http
        .post(
          'http://localhost:8080/ocr/?det_arch=db_resnet50&reco_arch=crnn_vgg16_bn&assume_straight_pages=true&preserve_aspect_ratio=true&detect_orientation=false&detect_language=false&symmetric_pad=true&straighten_pages=false&det_bs=2&reco_bs=128&disable_page_orientation=false&disable_crop_orientation=false&bin_thresh=0.1&box_thresh=0.1&resolve_lines=true&resolve_blocks=false&paragraph_break=0.0035',
          formData,
          {
            withCredentials: true,
          }
        )
        .subscribe({
          next: (response: any) => {
            this.isLoading = false; // Stop loading animation
            this.successMessage = 'File uploaded and processed successfully!';
            const words = this.extractWords(response);

            if (this.selectedAction === '/passport') {
              const passportNumber = this.extractPassportNumber(words);
              const { nom, prenom } = this.extractPassportNameAndFirstName(words);
              const { dateNaissance, dateDeDeliverance, dateExpiration } = this.extractPassportDates(words);
              const nationalite = words.find((word) => word === 'Marocaine') || 'Marocaine';
              const lieuNaissance = words.find((word) => word === 'Maroc') || 'Maroc';

              this.router.navigate([this.selectedAction], {
                state: { passportNumber, nom, prenom, nationalite, dateDeDeliverance, dateExpiration, dateNaissance, lieuNaissance },
              });
            } else {
              const { nom, prenom } = this.extractNameAndFirstName(words);
              const dateNaissance = this.extractDate(words, 'birth');
              const numCarte = this.extractNationalId(words);
              const dateFinCarte = this.extractDate(words, 'expiry');
              const adresse = this.extractAddress(words);

              this.router.navigate([this.selectedAction], {
                state: { nom, prenom, dateNaissance, numCarte, dateFinCarte, adresse },
              });
            }
          },
          error: (error) => {
            this.isLoading = false; // Stop loading animation
            this.successMessage = 'An error occurred while processing the file.';
          },
        });
    }
  }

  // Delete the selected file
  deleteFile(): void {
    this.selectedFile = null;
    this.successMessage = '';
  }
}
