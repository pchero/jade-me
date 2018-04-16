import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';

@Component({
  selector: 'buddy',
  templateUrl: './buddy.component.html',
  styleUrls: ['./buddy.component.scss']
})
export class BuddyComponent implements OnInit {

  private source: LocalDataSource = new LocalDataSource();
  private detail: any;

  constructor(private jService: JadeService) {
    this.detail = {};
    const db = jService.get_buddies();

    this.source.load(db().get());
    db.settings({
      onDBChange: () => { this.source.load(db().get()); },
    });
  }

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
      uuid_user: {
        title: 'Uuid user',
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

  private onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.jService.delete_buddy(event.data.uuid);
    }
  };

  private onRowSelect(event): void {
    this.detail = event.data;
  }

  private update_handler(): void {
    const data = {name: this.detail.name, detail: this.detail.detail};

    this.jService.update_buddy(this.detail.uuid, data);
  }

  private chat_handler(): void {
    const info = this.jService.get_info();
    const uuid = info.uuid;
    const buddy_uuid = this.detail.uuid_user;

    const members = [uuid, buddy_uuid];
    const name = 'My chat';
    const detail = 'Chat with ' + info.name + ', ' + this.detail.name;

    this.jService.add_chat(name, detail, 1, members);
  }

  ngOnInit() {
    // get
  }

}
