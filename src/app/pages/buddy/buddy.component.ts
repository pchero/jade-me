import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { JadeService } from '../../@core/data/jade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'buddy',
  templateUrl: './buddy.component.html',
  styleUrls: ['./buddy.component.scss']
})
export class BuddyComponent implements OnInit {

  private db;

  constructor(private jService: JadeService, private route: Router) {
    this.db = jService.get_buddies();
  }

  private buddy_handler(buddy: any): void {
    this.jService.set_curbuddy(buddy.uuid);

    this.route.navigate(['/pages/buddyinfo']);
  }

  ngOnInit() {
    // get
  }

}
