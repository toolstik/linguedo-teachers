import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {ReplaySubject} from "rxjs";
import {UserDto} from "../_transfer/UserDto";
import {map} from "rxjs/operators";

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

  login(token: string) {
    return this.jsonp.exec(this.resource, 'login', {token: token})
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
