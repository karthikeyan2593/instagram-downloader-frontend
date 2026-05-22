import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReelService {

  // STABLE PRODUCTION BACKEND
  private apiBase =
    'https://instagram-downloader--karthikn2593.replit.app/api/reels';

  constructor(private http: HttpClient) {}

  downloadReel(url: string): Observable<Blob> {

    return this.http.post(
      `${this.apiBase}/download-and-stream`,
      { url },
      {
        responseType: 'blob'
      }
    );
  }
}