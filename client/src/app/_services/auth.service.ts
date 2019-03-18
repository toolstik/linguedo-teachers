import {Injectable} from '@angular/core';
import {MyJsonpService} from "./my-jsonp.service";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {UserDto} from "../_transfer/UserDto";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser$ = new ReplaySubject<UserDto>(1);

  constructor(private jsonp: MyJsonpService) {
    const fromStorage = this.getCurrentUser();
    this.currentUser$.next(fromStorage);
  }

  private setCurrentUser(user: UserDto) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private getCurrentUser() {
    const storageValue = localStorage.getItem('currentUser');

    if (!storageValue)
      return null;

    return JSON.parse(storageValue) as UserDto;
  }

  currentUser(){
    return this.currentUser$.asObservable();
  }

  login(token: string) {
    this.jsonp.exec('login', {token: token})
      .pipe(map(i => {
        this.setCurrentUser(i);
        return i;
      }))
      .subscribe(this.currentUser$);

    return this.currentUser$.asObservable();
  }

  logout() {
    this.setCurrentUser(null);
    this.currentUser$.next(null);
  }
}
