import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  reelUrl = '';
  videoUrl = '';
  loading = false;
  errorMessage = '';

  private apiBase = 'https://instagram-downloader--karthikn2593.replit.app/api/reels';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  downloadReel() {

    if (!this.reelUrl.trim()) {
      this.errorMessage = 'URL enter pannunga!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.videoUrl = '';

    this.cdr.detectChanges();

    this.http.post<any>(
      `${this.apiBase}/download`,
      { url: this.reelUrl }
    ).subscribe({

      next: (response) => {

        console.log('Response:', response);

        this.loading = false;

        if (response?.videoUrl) {
          this.videoUrl = response.videoUrl;
        } else {
          this.errorMessage = response.message || 'Failed!';
        }

        this.cdr.detectChanges();
      },

      error: (err) => {

        this.loading = false;

        this.errorMessage =
          err?.error?.message || 'Download failed!';

        this.cdr.detectChanges();
      }
    });
  }

startDownload() {

  if (!this.videoUrl) {
    this.errorMessage = 'Video not ready!';
    return;
  }

  fetch(this.videoUrl)
    .then(response => response.blob())
    .then(blob => {

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = `instagram-reel-${Date.now()}.mp4`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      this.errorMessage = 'Download failed!';
    });
}
}