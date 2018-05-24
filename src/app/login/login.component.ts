import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { JadeService } from '../@core/data/jade.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  username: string;
  password: string;
  submit_invalid = false;

  constructor(private jService: JadeService, private route: Router) {
  }

  ngOnInit() {
  }

  signin_handler() {
    this.submit_invalid = true;

    this.jService.login(this.username, this.password).subscribe(
      res => {
        console.log("Logged in.");

        if(!res) {
          this.submit_invalid = false;
          return;
        }

        const token = res.result.authtoken;

        // set authtoken
        this.jService.set_authtoken(token);

        // get info
        this.jService.init().subscribe(
          res => {
            if(res != true) {
              console.log("Could not login correctly.");
              return;
            }
            
            // move to main page
            this.route.navigate(['/']);
          }
        );
      },
      error => {
        console.log("Faied to login. " + error);
        this.submit_invalid = false;
      }
    );
  }
}
