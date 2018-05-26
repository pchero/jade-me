import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { JadeService } from '../../@core/data/jade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'roominfo',
  templateUrl: './roominfo.component.html',
  styleUrls: ['./roominfo.component.scss']
})
export class RoominfoComponent implements OnInit {
  private chat: any;

  constructor(private jService: JadeService, private route: Router) {
    const uuid = jService.get_curchat();
    console.log("uuid info. uuid: " + uuid);

    const db = jService.get_chats();

    this.chat = db({uuid: uuid}).first();
    console.log("Buddy info. " + this.chat);
  }

  private close_handler() {
    this.route.navigate(['/pages/room']);
  }

  private delete_handler() {
    if (window.confirm('Are you sure you want to delete?')) {
      this.jService.delete_chat(this.chat.uuid);
      this.route.navigate(['/pages/chat']);
    }
  }

  private update_handler(): void {
    this.jService.update_chat(this.chat.uuid, this.chat);
  }

  ngOnInit() {
  }

}
