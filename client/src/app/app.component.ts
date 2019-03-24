import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {UserDto} from "../../../shared/transfer/UserDto";
import {AuthService} from "./_services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  currentUser$: Observable<UserDto>;

  constructor(private authService: AuthService) {
    this.currentUser$ = authService.currentUser();
  }

  logout(){
    this.authService.logout();
  }
}
