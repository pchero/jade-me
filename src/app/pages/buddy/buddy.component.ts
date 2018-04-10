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

  source: LocalDataSource = new LocalDataSource();

  constructor(private jService: JadeService) {

    const db = jService.get_buddies();

    this.source.load(db().get());
    db.settings({
      onDBChange: () => { this.source.load(db().get()); },
    });
  }

  settings = {
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


  ngOnInit() {
    // get
  }

}
