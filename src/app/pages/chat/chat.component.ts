import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private db;

  constructor(private jService: JadeService, private route: Router) {
    this.db = jService.get_chats();
  }

  ngOnInit() {
  }

  private chatting_handler(chat) {
    this.jService.set_curchat(chat.uuid);
    this.jService.set_curchatroom(chat.room.uuid);

    this.route.navigate(['/pages/room']);
  }

  private chatting_delete(chat) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.jService.delete_chat(chat.uuid);
    }
  }
}
