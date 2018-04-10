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
  private db;
  private info;
  private message: string;

  source: LocalDataSource = new LocalDataSource();

  constructor(private jService: JadeService) {
    this.chat_uuid = this.jService.get_curchat();
    this.info = this.jService.get_info();

    this.db = this.jService.get_messages(this.chat_uuid);

    console.log(this.db().order("tm_create asec").get());

    console.log("Fired RoomComponent.");
  }

  send_message() {
    console.log('Fired send_message. message: ' + this.message);
    this.jService.send_chatmessage(this.message);
    this.message = '';
  }

  ngOnInit() {
  }

}
