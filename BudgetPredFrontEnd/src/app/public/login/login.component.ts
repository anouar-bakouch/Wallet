import { Component, OnInit} from '@angular/core';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username: string="";
  password: string="";

  constructor(private loginService: LoginService) {}

  ngOnInit() {}

  login() {
    this.loginService.login(this.username, this.password)
      .subscribe(
        (success) => {
          if (success) {
            // The user has successfully logged in.
          } else {
            // The login failed.
          }
        },
        (error) => {
          // An error occurred while logging in.
        }
      );
  }

}
