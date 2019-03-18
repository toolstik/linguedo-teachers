import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {mergeMap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

type response = {
  success: boolean,
  body?: any,
  error?: any
};

@Injectable({
  providedIn: 'root'
})
export class MyJsonpService {

  private url = environment.service.url;

  constructor(private http: HttpClient) {
  }

  private getToken() {
    const user = AuthService.getCurrentUser();
    return user ? user.token : null;
  }

  exec<T = any>(method: string, body?: any): Observable<T> {
    const request = {
      token: this.getToken(),
      method: method,
      body: body
    };

    let httpParams = new HttpParams()
      .set('request', JSON.stringify(request));

    return this.http.jsonp<response>(`${this.url}?${httpParams.toString()}`, 'callback')
      .pipe(mergeMap(resp => {
        if (resp.success) {
          return Observable.create(observer => {
            observer.next(resp.body);
          });
        }

        return throwError(resp.error);
      }))
  }
}
