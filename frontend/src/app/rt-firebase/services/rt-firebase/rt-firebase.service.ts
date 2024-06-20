import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RtFirebaseService {
  private readonly apiUrl = 'https://your-project-id.cloudfunctions.net/signJwt';

  constructor(private http: HttpClient) {}

  callSignJwt(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
