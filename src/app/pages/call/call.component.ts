import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from 'ng2-smart-table';
import { JadeService } from '../../@core/data/jade.service';

@Component({
  selector: 'jade-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();

  constructor(private jService: JadeService) {

    const db = jService.get_calls();

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
      unique_id: {
        title: 'Unique id',
        type: 'string',
      },
      channel: {
        title: 'chanel',
        type: 'string',
      },
    },
  }


  ngOnInit() {
    // get
  }

}
