import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';

@Component({
  selector: 'jade-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  private chat_uuid: string = '';
  private chatroom_uuid: string = '';
  private db;
  private info;
  private chat_info;
  private message: string;

  private name: string;
  private detail: string;

  source: LocalDataSource = new LocalDataSource();

  constructor(private jService: JadeService) {
    this.chat_uuid = this.jService.get_curchat();
    this.chatroom_uuid = this.jService.get_curchatroom();
    this.info = this.jService.get_info();
    this.chat_info = this.jService.get_chat(this.chat_uuid);

    this.db = this.jService.get_chatroom_messages(this.chatroom_uuid);

    // console.log(this.db().order("tm_create asec").get());

    this.name = this.chat_info.name;
    this.detail = this.chat_info.detail;
  }

  send_message() {
    console.log('Fired send_message. message: ' + this.message);
    this.jService.send_chatmessage(this.message);
    this.message = '';
  }

  send_handler() {
    this.send_message();
  }

  call_handler() {
    const uuid = this.info.uuid;
    
    // get target uuid
    let target = '';
    const j_members = this.chat_info.room.members;
    for(let i = 0; i < j_members.length; i++) {
      target = j_members[i];
      if(target != uuid) {
        break;
      }
    }
    console.log(j_members);

    if(target == '') {
      return;
    }

    this.jService.send_call(target, "user");
  }

  ngOnInit() {
  }

}
