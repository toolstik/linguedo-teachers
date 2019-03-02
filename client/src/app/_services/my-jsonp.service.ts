import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyJsonpService {

  private url = 'https://script.google.com/macros/s/AKfycbygdFY7BEBt_DA63B9AnzJ5QMiU1jRnEIKjeL_ZRukI/exec';

  constructor(private http: HttpClient) {
  }

  exec<T = any>(method: string, body?: any): Observable<T> {
    let httpParams = new HttpParams()
      .set('method', method);

    if (body) {
      httpParams = httpParams.append('body', JSON.stringify(body));
    }

    return this.http.jsonp<any>(`${this.url}?${httpParams.toString()}`, 'callback')
      .pipe(map(i => <T>i));
  }
}
