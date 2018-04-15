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

  private settings = {
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
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

    const db = jService.get_chats();

    this.source.load(db().get());
    db.settings({
      onDBChange: () => { this.source.load(db().get()); },
    });
  }

  ngOnInit() {
  }

  private onRowSelect(event): void {
    const detail = Object.assign({}, event.data);
    const uuid = detail.uuid;
    const room_uuid = detail.room.uuid;

    this.jService.set_curchat(uuid);
    this.jService.set_curchatroom(room_uuid);
  }

  private onUserRowSelect(event): void {
    const detail = Object.assign({}, event.data);
    const uuid = detail.uuid;
    const room_uuid = detail.room.uuid

    this.jService.set_curchat(uuid);
    this.jService.set_curchatroom(room_uuid);

    this.route.navigate(['/pages/room']);
  }

  private onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.jService.delete_chat(event.data.uuid);
    }
  };

}
