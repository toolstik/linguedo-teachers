import {Component, OnInit} from '@angular/core';
import {AuthService} from "../_services/auth.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  login() {
    if (this.password && this.email)
      this.authService.login(this.email, this.password).subscribe();
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.login();
    }
  }

}
