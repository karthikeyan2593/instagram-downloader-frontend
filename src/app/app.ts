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

private apiBase = 'https://a0044a88-1064-4411-90b2-91cdae8595ba-00-2hvzb28y196eg.sisko.replit.dev/api/reels';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef  // ← add pannunga
  ) {}

  downloadReel() {
    if (!this.reelUrl.trim()) {
      this.errorMessage = 'URL enter pannunga!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.videoUrl = '';
    this.cdr.detectChanges(); // ← UI update

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
        this.cdr.detectChanges(); // ← UI update
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Download failed!';
        this.cdr.detectChanges(); // ← UI update
      }
    });
  }

  startDownload() {
    if (!this.reelUrl.trim()) return;

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http.post(
      `${this.apiBase}/download-and-stream`,
      { url: this.reelUrl },
      { responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        this.loading = false;
        this.cdr.detectChanges();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const reelId = this.reelUrl
        ?.split('/')[0]
        ?.split('?')[0] || 'reel';
        link.download = `instagram-reel-${reelId}.mp4`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Download failed! Try again.';
        this.cdr.detectChanges();
      }
    });
  }
}