import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReelService {

  // STABLE PRODUCTION BACKEND
  private apiBase =
'https://a0044a88-1064-4411-90b2-91cdae8595ba-00-2hvzb28y196eg.sisko.replit.dev/api/reels';

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