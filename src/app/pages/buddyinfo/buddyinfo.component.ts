import { Component, OnInit } from '@angular/core';
import { JadeService } from '../../@core/data/jade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'buddyinfo',
  templateUrl: './buddyinfo.component.html',
  styleUrls: ['./buddyinfo.component.scss']
})
export class BuddyinfoComponent implements OnInit {
  private buddy: any;

  constructor(private jService: JadeService, private route: Router) {
    const uuid = jService.get_curbuddy();
    console.log("uuid info. uuid: " + uuid);

    const db = jService.get_buddies();

    this.buddy = db({uuid: uuid}).first();
    console.log("Buddy info. " + this.buddy);
  }

  private close_handler() {
    this.route.navigate(['/pages/buddy']);
  }

  private delete_handler() {
    if (window.confirm('Are you sure you want to delete?')) {
      this.jService.delete_buddy(this.buddy.uuid);
    }
  }

  private update_handler(): void {
    const data = {name: this.buddy.name, detail: this.buddy.detail};

    this.jService.update_buddy(this.buddy.uuid, data);
  }

  private sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  private chat_handler(): void {
    const info = this.jService.get_info();
    const uuid = info.uuid;
    const buddy_uuid = this.buddy.uuid_user;

    const members = [uuid, buddy_uuid];
    const name = this.buddy.name;
    const detail = 'Chat with ' + info.name + ', ' + this.buddy.name;
    console.log("Member info. " + members);

    let chat_uuid = this.jService.get_chat_by_members(members);
    if(!chat_uuid) {
      this.jService.add_chat(name, detail, 1, members);
    }

    this.wait_new_chat(members, 20);

    console.log("Chat uuid. " + chat_uuid);

  }

  private wait_new_chat(members, count) {
    if(count <= 0) {
      return;
    }

    setTimeout( () => {

      const chat_uuid = this.jService.get_chat_by_members(members);
      console.log(chat_uuid);
      if(chat_uuid) {
        this.jService.set_curchat(chat_uuid);
        this.route.navigate(['/pages/room']);
        return;
      }

      this.wait_new_chat(members, count--);
    }, 100);
  }

  private call_handler(): void {
    const target = this.buddy.uuid_user;
    
    if(target == '') {
      return;
    }

    this.jService.send_call(target, "user");  
  }

  ngOnInit() {
  }

}
