import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  token: string;

  error$ = new BehaviorSubject(null);

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  login() {
    if (this.token)
      this.authService.login(this.token).subscribe(
        () => {
          this.error$.next(null);
        },
        error => {
          this.error$.next(error.message);
        }
      );
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.login();
    }
  }

}
