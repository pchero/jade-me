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
  
  source: LocalDataSource = new LocalDataSource();
  detail: any;

  private settings = {
    mode: "inline",
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      columnTitle: '',
    },
    columns: {
      uuid: {
        title: 'Uuid',
        type: 'string',
        editable: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      detail: {
        title: 'Detail',
        type: 'string',
      }
    },
  }

  constructor(private jService: JadeService, private route: Router) {
    this.detail = {};

    const db = jService.get_chats();

    this.source.load(db().get());
    db.settings({
      onDBChange: () => { this.source.load(db().get()); },
    });
  }

  ngOnInit() {
  }

  private onRowSelect(event): void {
    this.detail = Object.assign({}, event.data);
    const uuid = this.detail.uuid;
    const room_uuid = this.detail.room.uuid;

    this.jService.set_curchat(uuid);
    this.jService.set_curchatroom(room_uuid);
  }

  private onUserRowSelect(event): void {
    this.detail = Object.assign({}, event.data);
    const uuid = this.detail.uuid;
    const room_uuid = this.detail.room.uuid

    this.jService.set_curchat(uuid);
    this.jService.set_curchatroom(room_uuid);
  }

  private onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.jService.delete_chat(event.data.uuid);
    }
  }

  private update_handler(): void {

    const data = {
      name: this.detail.name,
      detail: this.detail.detail,
    };

    this.jService.update_chat(this.detail.uuid, data);
  }

  private chat_handler(): void {
    this.route.navigate(['/pages/room']);
  }

}
