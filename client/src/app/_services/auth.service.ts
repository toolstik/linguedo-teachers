import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";
import {map} from "rxjs/operators";
import {UserDto} from '../../../../shared/transfer/UserDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private resource = 'auth';

  private currentUserSubj = new ReplaySubject<UserDto>(1);

  constructor(private jsonp: MyJsonpService) {
    const fromStorage = AuthService.getCurrentUser();
    this.currentUserSubj.next(fromStorage);
  }

  private static setCurrentUser(user: UserDto) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static getCurrentUser() {
    const storageValue = localStorage.getItem('currentUser');

    if (!storageValue)
      return null;

    return JSON.parse(storageValue) as UserDto;
  }

  currentUser() {
    return this.currentUserSubj.asObservable();
  }

  login(email: string, password: string) {
    return this.jsonp.exec(this.resource, 'login', {email: email, password: password})
      .pipe(map(i => {
        AuthService.setCurrentUser(i);
        this.currentUserSubj.next(i);
        return i;
      }));
  }

  logout() {
    AuthService.setCurrentUser(null);
    this.currentUserSubj.next(null);
  }
}
