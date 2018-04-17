import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { JadeService } from '../@core/data/jade.service';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  
  username: string;
  password: string;

  constructor(private jService: JadeService, private route: Router) { }

  ngOnInit() {
    this.jService.logout();
    this.route.navigate(['/login']);
  }
}
