import { Component, OnInit } from '@angular/core';

import { JadeService } from '../@core/data/jade.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  username: string;
  password: string;

  constructor(private jService: JadeService) { }

  ngOnInit() {
  }
  
  signin_handler() {
    this.jService.login(this.username, this.password).subscribe(
      res => {
        console.log(res);
        const token = res.result.authtoken;

        this.jService.set_authtoken(token);
      }
    );
  }
}
